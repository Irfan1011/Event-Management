import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

// import RootLayout, { loader as checkAuthLoader } from "@layouts/Root";
// import HomePage from "@pages/Home";
// import EventsRootLayout from "@layouts/EventsRoot";
// import EventsPage, { loader as eventsLoader } from "@pages/Events";
// import EventDetailPage, {
//   loader as eventDetailLoader,
//   action as deleteEventAction,
// } from "@pages/EventDetail";
// import EditEventPage from "@pages/EditEvent";
// import NewEventPage from "@pages/NewEvent";
// import { action as manipulateEventAction } from "@components/EventForm";
// import NewsletterPage, { action as newsletterAction } from "@pages/Newsletter";
// import Authentication, { authAction, logoutAction }  from "@pages/Authentication";

import "./index.css";

const RootLayout = lazy(() => import("@layouts/Root"));
const HomePage = lazy(() => import("@pages/Home"));
const EventsRootLayout = lazy(() => import("@layouts/EventsRoot"));
const EventsPage = lazy(() => import("@pages/Events"));
const EventDetailPage = lazy(() => import("@pages/EventDetail"));
const EditEventPage = lazy(() => import("@pages/EditEvent"));
const NewEventPage = lazy(() => import("@pages/NewEvent"));
const NewsletterPage = lazy(() => import("@pages/Newsletter"));
const Authentication = lazy(() => import("@pages/Authentication"));

const router = createBrowserRouter([
  {
    path: "",
    element: (
      <Suspense fallback={<p>Loading...</p>}>
        <RootLayout />
      </Suspense>
    ),
    id: "root",
    loader: async (meta) => {
      const module = await import("@layouts/Root");
      return module.loader(meta);
    },
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: "events",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <EventsRootLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<p>Loading...</p>}>
                <EventsPage />
              </Suspense>
            ),
            loader: async () => {
              const module = await import("@pages/Events");
              return module.loader();
            },
          },
          {
            path: ":eventId",
            id: "event-detail",
            loader: async (meta) => {
              const module = await import("@pages/EventDetail");
              return module.loader(meta);
            },
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<p>Loading...</p>}>
                    <EventDetailPage />
                  </Suspense>
                ),
                action: async (meta) => {
                  const module = await import("@pages/EventDetail");
                  return module.action(meta);
                },
              },
              {
                path: "edit",
                element: (
                  <Suspense fallback={<p>Loading...</p>}>
                    <EditEventPage />
                  </Suspense>
                ),
                action: async (meta) => {
                  const module = await import("@components/EventForm");
                  return module.action(meta);
                },
                loader: async (meta) => {
                  const module = await import("@layouts/Root");
                  return module.loader(meta);
                },
              },
            ],
          },
          {
            path: "new",
            element: (
              <Suspense fallback={<p>Loading...</p>}>
                <NewEventPage />
              </Suspense>
            ),
            action: async (meta) => {
              const module = await import("@components/EventForm");
              return module.action(meta);
            },
            loader: async (meta) => {
              const module = await import("@layouts/Root");
              return module.loader(meta);
            },
          },
        ],
      },
      {
        path: "newsletter",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <NewsletterPage />
          </Suspense>
        ),
        action: async (meta) => {
          const module = await import("@pages/Newsletter");
          return module.action(meta);
        },
      },
      {
        path: "auth",
        element: (
          <Suspense fallback={<p>Loading...</p>}>
            <Authentication />
          </Suspense>
        ),
        action: async (meta) => {
          const module = await import("@pages/Authentication");
          return module.authAction(meta);
        },
      },
      {
        path: "logout",
        action: async () => {
          const module = await import("@pages/Authentication");
          return module.logoutAction();
        },
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
