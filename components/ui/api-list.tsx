"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useOrigin } from "@/hooks/use-origin";

import ApiAlert from "./api-alert";

interface ApiListProps {
  entity: {
    name: string;
    id: string;
  };
}

const ApiList: React.FC<ApiListProps> = ({ entity }) => {
  const params = useParams();
  const origin = useOrigin();

  const baseUrl = `${origin}/api/${params.storeId}`;

  return (
    <>
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entity.name}`}
      />
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entity.name}/{${entity.id}}`}
      />
      <ApiAlert
        title="POST"
        variant="admin"
        description={`${baseUrl}/${entity.name}`}
      />
      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${baseUrl}/${entity.name}/{${entity.id}}`}
      />
      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${baseUrl}/${entity.name}/{${entity.id}}`}
      />
    </>
  );
};

export default ApiList;
