import { Suspense } from "react";
import {
  useRouteLoaderData,
  redirect,
  Await,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";

import EventItem from "@components/EventItem";
import EventsList from "@components/EventsList";

function EventDetailPage() {
  const { event, events } = useRouteLoaderData("event-detail");

  return (
    <>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={event}>
          {(loadedEvent) => <EventItem event={loadedEvent} />}
        </Await>
      </Suspense>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={events}>
          {(loadedEvents) => <EventsList events={loadedEvents} />}
        </Await>
      </Suspense>
    </>
  );
}

export default EventDetailPage;

async function loadEvent(id: string) {
  const response = await fetch(
    `${import.meta.env.VITE_REST_API_URL}/events/` + id,
  );

  if (!response.ok) {
    throw new Response("Could not fetch details for selected event.", {
      status: 500,
    });
  }

  const resData = await response.json();
  return resData.event;
}

async function loadEvents() {
  const response = await fetch(`${import.meta.env.VITE_REST_API_URL}/events`);

  if (!response.ok) {
    // return { isError: true, message: 'Could not fetch events.' };
    // throw new Response(JSON.stringify({ message: 'Could not fetch events.' }), {
    //   status: 500,
    // });
    throw new Response("Could not fetch events.", {
      status: 500,
    });
  }

  const resData = await response.json();
  return resData.events;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.eventId;

  if (!id) throw new Response("Event Id Not Found", { status: 404 });

  return {
    event: await loadEvent(id),
    events: loadEvents(),
  };
}

export async function action({ params, request }: ActionFunctionArgs) {
  const eventId = params.eventId;

  const response = await fetch(
    `${import.meta.env.VITE_REST_API_URL}/events` + eventId,
    {
      method: request.method,
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Response("Could not delete event.", {
      status: 500,
    });
  }
  return redirect("/events");
}
