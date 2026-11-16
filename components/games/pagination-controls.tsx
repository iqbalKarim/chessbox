/**
 * Pagination controls component for cursor-based pagination
 */

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  canGoNext: boolean;
  canGoPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  isLoading?: boolean;
  totalCount?: number;
  pageSize?: number;
  currentPageInfo?: string;
}

export function PaginationControls({
  canGoNext,
  canGoPrevious,
  onNext,
  onPrevious,
  isLoading = false,
  totalCount,
  pageSize = 50,
  currentPageInfo,
}: PaginationControlsProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {currentPageInfo ? (
            <span>{currentPageInfo}</span>
          ) : totalCount ? (
            <span>
              Showing up to {pageSize} of {totalCount} games
            </span>
          ) : (
            <span>Showing {pageSize} games per page</span>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onPrevious}
            disabled={!canGoPrevious || isLoading}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            onClick={onNext}
            disabled={!canGoNext || isLoading}
            variant="outline"
            size="sm"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
