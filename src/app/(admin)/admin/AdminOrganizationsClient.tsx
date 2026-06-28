'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { routes } from '@/config/routes';
import {
  adminOrganizationStatusLabels,
  fetchAdminOrganizationsPage,
  updateAdminOrganizationStatus,
  type AdminOrganizationStatusTab,
} from '@/lib/admin-api/organizations';
import { cn } from '@/lib/cn';
import type { CatalogOrganization } from '@/types/catalog-api';

const adminOrganizationsQueryKey = (
  status: AdminOrganizationStatusTab,
  offset: number,
  search: string,
) => ['admin-organizations', status, offset, search] as const;

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatLocation(organization: CatalogOrganization): string {
  const location = organization.locations[0];

  if (!location) {
    return '—';
  }

  const parts = [location.street, location.city, location.adminUnit]
    .filter(Boolean)
    .map((part) => part?.trim())
    .filter(Boolean);

  return parts.join(', ') || '—';
}

function formatCategories(organization: CatalogOrganization): string {
  if (organization.categories.length === 0) {
    return '—';
  }

  return organization.categories.map((category) => category.name).join(', ');
}

const actionButtonClassName =
  'h-8 shrink-0 cursor-pointer whitespace-nowrap px-2.5 text-xs sm:px-3';

export default function AdminOrganizationsClient() {
  const queryClient = useQueryClient();
  const [activeStatus, setActiveStatus] = useState<AdminOrganizationStatusTab>('pending');
  const [offset, setOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [rejectTarget, setRejectTarget] = useState<CatalogOrganization | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchQuery]);

  useEffect(() => {
    setOffset(0);
  }, [debouncedSearch, activeStatus]);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: adminOrganizationsQueryKey(activeStatus, offset, debouncedSearch),
    queryFn: () =>
      fetchAdminOrganizationsPage({
        status: activeStatus,
        offset,
        search: debouncedSearch || undefined,
      }),
  });

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      rejectionReason: reason,
    }: {
      id: number;
      status: 'approved' | 'rejected' | 'archived';
      rejectionReason?: string;
    }) =>
      updateAdminOrganizationStatus(id, {
        status,
        rejectionReason: reason ?? null,
      }),
    onSuccess: async () => {
      setActionError('');
      setRejectTarget(null);
      setRejectionReason('');
      await queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
    },
    onError: () => {
      setActionError('Не вдалося оновити статус організації. Спробуйте ще раз.');
    },
  });

  const organizations = data?.items ?? [];
  const hasMore = data?.hasMore ?? false;
  const isUpdating = statusMutation.isPending;

  const tabs = useMemo(
    () =>
      (Object.keys(adminOrganizationStatusLabels) as AdminOrganizationStatusTab[]).map(
        (status) => ({
          id: status,
          label: adminOrganizationStatusLabels[status],
        }),
      ),
    [],
  );

  const handleStatusChange = useCallback(
    (
      organization: CatalogOrganization,
      status: 'approved' | 'rejected' | 'archived',
      reason?: string,
    ) => {
      setActionError('');
      statusMutation.mutate({
        id: organization.id,
        status,
        rejectionReason: reason,
      });
    },
    [statusMutation],
  );

  const handleRejectSubmit = () => {
    if (!rejectTarget) {
      return;
    }

    handleStatusChange(
      rejectTarget,
      'rejected',
      rejectionReason.trim() || undefined,
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-eUkraine text-2xl font-semibold text-black">
            Модерація організацій
          </h1>
          <p className="mt-1 text-sm text-[#666666]">
            Підтвердження, відхилення та архівація заявок
          </p>
        </div>
        <Link
          href={routes.home}
          className="text-sm text-black underline-offset-2 hover:underline"
        >
          ← До каталогу
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={cn(
                'cursor-pointer rounded-full px-4 py-2 text-sm transition',
                activeStatus === tab.id
                  ? 'bg-black text-white'
                  : 'bg-[#E7E7E7] text-black hover:bg-[#dcdcdc]',
              )}
              onClick={() => {
                setActiveStatus(tab.id);
                setActionError('');
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
          }}
          placeholder="Пошук за назвою організації"
          className="w-full max-w-md rounded-xl border border-black/20 bg-white px-4 py-2.5 text-sm text-black outline-none transition placeholder:text-[#999999] focus:border-black"
        />
      </div>

      {actionError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-[20px] border border-black/10 bg-white">
        {isLoading ? (
          <p className="px-6 py-10 text-center text-sm text-[#666666]">
            Завантаження...
          </p>
        ) : isError ? (
          <div className="space-y-4 px-6 py-10 text-center">
            <p className="text-sm text-red-700">
              Не вдалося завантажити список організацій.
            </p>
            <Button variant="secondary" onClick={() => void refetch()}>
              Спробувати знову
            </Button>
          </div>
        ) : organizations.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-[#666666]">
            {debouncedSearch
              ? 'За цим запитом нічого не знайдено.'
              : 'Немає організацій у цій категорії.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-black/10 bg-[#F4F4F4]">
                <tr>
                  <th className="px-4 py-3 font-medium">Назва</th>
                  <th className="px-4 py-3 font-medium">Категорія</th>
                  <th className="px-4 py-3 font-medium">Адреса</th>
                  <th className="px-4 py-3 font-medium">Створено</th>
                  <th className="min-w-[360px] px-4 py-3 font-medium">Дії</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((organization) => (
                  <tr
                    key={organization.id}
                    className="border-b border-black/5 last:border-b-0"
                  >
                    <td className="px-4 py-4 align-top">
                      <div className="space-y-1">
                        <p className="font-medium text-black">{organization.name}</p>
                        {organization.description ? (
                          <p className="line-clamp-2 text-xs text-[#666666]">
                            {organization.description}
                          </p>
                        ) : null}
                        {organization.rejectionReason ? (
                          <p className="text-xs text-red-700">
                            Причина відхилення: {organization.rejectionReason}
                          </p>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-[#333333]">
                      {formatCategories(organization)}
                    </td>
                    <td className="px-4 py-4 align-top text-[#333333]">
                      {formatLocation(organization)}
                    </td>
                    <td className="px-4 py-4 align-top whitespace-nowrap text-[#333333]">
                      {formatDate(organization.createdAt)}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-nowrap items-center gap-1.5">
                        <Link
                          href={routes.company(organization.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            actionButtonClassName,
                            'inline-flex items-center rounded-md border border-black/20 bg-white text-black hover:bg-[#F4F4F4]',
                          )}
                        >
                          Переглянути
                        </Link>

                        {activeStatus !== 'approved' ? (
                          <Button
                            size="sm"
                            disabled={isUpdating}
                            className={actionButtonClassName}
                            onClick={() => {
                              handleStatusChange(organization, 'approved');
                            }}
                          >
                            Підтвердити
                          </Button>
                        ) : null}

                        {activeStatus !== 'rejected' ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={isUpdating}
                            className={actionButtonClassName}
                            onClick={() => {
                              setRejectTarget(organization);
                              setRejectionReason('');
                            }}
                          >
                            Відхилити
                          </Button>
                        ) : null}

                        {activeStatus !== 'archived' ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={isUpdating}
                            className={actionButtonClassName}
                            onClick={() => {
                              handleStatusChange(organization, 'archived');
                            }}
                          >
                            В архів
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!isLoading && organizations.length > 0 ? (
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="secondary"
            disabled={offset === 0 || isFetching}
            onClick={() => {
              setOffset((current) => Math.max(0, current - 15));
            }}
          >
            ← Попередні
          </Button>
          <span className="text-sm text-[#666666]">
            Показано {offset + 1}–{offset + organizations.length}
          </span>
          <Button
            variant="secondary"
            disabled={!hasMore || isFetching}
            onClick={() => {
              setOffset((current) => current + 15);
            }}
          >
            Наступні →
          </Button>
        </div>
      ) : null}

      <Modal
        isOpen={Boolean(rejectTarget)}
        onClose={() => {
          if (!isUpdating) {
            setRejectTarget(null);
            setRejectionReason('');
          }
        }}
      >
        <div className="space-y-4 pr-6">
          <div>
            <h2 className="font-eUkraine text-lg font-semibold text-black">
              Відхилити організацію
            </h2>
            <p className="mt-1 text-sm text-[#666666]">
              {rejectTarget?.name}
            </p>
          </div>

          <label className="block space-y-2">
            <span className="text-sm text-black">Причина відхилення (необов&apos;язково)</span>
            <textarea
              value={rejectionReason}
              onChange={(event) => {
                setRejectionReason(event.target.value);
              }}
              rows={4}
              className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm outline-none focus:border-black"
              placeholder="Опишіть причину відхилення"
            />
          </label>

          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              disabled={isUpdating}
              onClick={() => {
                setRejectTarget(null);
                setRejectionReason('');
              }}
            >
              Скасувати
            </Button>
            <Button disabled={isUpdating} onClick={handleRejectSubmit}>
              Відхилити
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
