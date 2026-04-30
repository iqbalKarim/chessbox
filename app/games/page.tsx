"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { getGames } from "@/lib/axios/backendApi";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default function Games() {
  const [currentUrl, setCurrentUrl] = useState<string>('');

  const { isPending, error, data } = useQuery({
    queryKey: ["games", currentUrl],
    queryFn: async () => {
      var res = await getGames(currentUrl || undefined);
      console.log("queryGame", res);
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

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Games</CardTitle>
        </CardHeader>

        {data?.results && (
          <div className="container mx-auto p-4">
            
            <DataTable 
              columns={columns} 
              data={data} 
              onNext={handleNext}
              onPrevious={handlePrevious}
              hasNext={!!data.next}
              hasPrevious={!!data.previous}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
