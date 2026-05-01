"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { getGames } from "@/lib/axios/backendApi";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { ColumnFiltersState } from "@tanstack/react-table";

export default function Games() {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const { isPending, error, data } = useQuery({
    queryKey: ["games", currentUrl, columnFilters],
    queryFn: async () => {
      const ecoFilter = columnFilters.find(f => f.id === 'opening')
      const ecoCode = ecoFilter ? ecoFilter.value : ''
      const params = { eco_code: ecoCode }
      var res = await getGames(currentUrl || undefined, params);
      return res;
    },
  });

  const handleNext = () => {
    if (data?.next) {
      setCurrentUrl(data.next);
    }
  };

  const handlePrevious = () => {
    if (data?.previous) {
      setCurrentUrl(data.previous);
    }
  };

  function setColumnFiltersHandler(filters: any){
    setCurrentUrl("")
    setColumnFilters(filters)
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Games</CardTitle>
        </CardHeader>

        {data?.results && (
          <div className="container mx-auto px-4">
            <DataTable 
              columns={columns} 
              data={data} 
              onNext={handleNext}
              onPrevious={handlePrevious}
              hasNext={!!data.next}
              hasPrevious={!!data.previous}
              columnFilters={columnFilters}
              setColumnFilters={setColumnFiltersHandler as any}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
