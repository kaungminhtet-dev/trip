"use server";

import { cookies } from 'next/headers';
import { Query } from './type';

const cookieStore = await cookies();
const URI = process.env["BACKEND_API"];

export const getByQuery = async (
  endpoint: string,
  query: Query,
  auth = false,
) => {
  if (auth) {
    return fetch(`${URI}/${endpoint}?`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookieStore.get("token")?.value}}`,
      },
    });
  }

  return fetch(
    `${URI}/${endpoint}?page=${query.page}&size=${query.size}&sort_by=${query.sort_by}&order=${query.order_by}`,
  );
};

export const getById = async (endpoint: string, id: string, auth = false) => {
  if (auth) {
    return fetch(`${URI}/${endpoint}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookieStore.get("token")?.value}}`,
      },
    });
  }

  return fetch(`${URI}/${endpoint}/${id}`);
};

export const post = async (endpoint: string, data: unknown, auth = false) => {
  if (auth) {
    return fetch(`${URI}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookieStore.get("token")?.value}}`,
      },
      body: JSON.stringify(data),
    });
  }

  return fetch(`${URI}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const patch = async (
  endpoint: string,
  id: string,
  data: unknown,
  auth = false,
) => {
  if (auth) {
    return fetch(`${URI}/${endpoint}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookieStore.get("token")?.value}}`,
      },
      body: JSON.stringify(data),
    });
  }
  return fetch(`${URI}/${endpoint}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const deleteById = async (
  endpoint: string,
  id: string,
  auth = false,
) => {
  if (auth) {
    return fetch(`${URI}/${endpoint}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookieStore.get("token")?.value}}`,
      },
    });
  }
  return fetch(`${URI}/${endpoint}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
