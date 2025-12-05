'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

interface PaginationProps {
  totalPages: number;
  maxVisiblePages: number;
}

export function AppPagination({
                                totalPages,
                                maxVisiblePages,
                              }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const paginationItems = useMemo(() => {
    const pages: (number | string)[] = [];
    const halfWindow = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - halfWindow);
      let end = Math.min(totalPages - 1, currentPage + halfWindow);

      if (currentPage <= halfWindow + 1) {
        end = Math.min(totalPages - 1, maxVisiblePages - 1);
      }

      if (currentPage >= totalPages - halfWindow) {
        start = Math.max(2, totalPages - maxVisiblePages + 2);
      }

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages, maxVisiblePages]);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={isFirstPage}
            aria-label="Go to previous page"
            className={currentPage <= 1 ? 'pointer-events-none opacity-50' : undefined}
            href={createPageURL(currentPage - 1)}
          />
        </PaginationItem>
        {
          paginationItems.map((page) => {
            if (page === '...') {
              return (
                <PaginationItem key={page}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return (
              <PaginationItem
                className={
                  currentPage == page
                    ? 'bg-primary text-primary-foreground rounded-md'
                    : ''
                }
                key={page}
              >
                <PaginationLink
                  href={createPageURL(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })
        }
        <PaginationItem>
          <PaginationNext
            aria-disabled={isLastPage}
            aria-label="Go to next page"
            className={isLastPage ? 'pointer-events-none opacity-50' : undefined}
            href={createPageURL(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
