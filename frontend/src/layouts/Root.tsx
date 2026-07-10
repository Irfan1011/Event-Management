import { Outlet, redirect, type LoaderFunctionArgs } from "react-router";

import MainNavigation from "@components/MainNavigation";

function RootLayout() {
  // const navigation = useNavigation();

  return (
    <>
      <MainNavigation />
      <main>
        {/* {navigation.state === 'loading' && <p>Loading...</p>} */}
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const urlPath = new URL(request.url).pathname;
  const eventId = params.eventId;

  const response = await fetch("http://localhost:8080/isAuth", {
    credentials: "include",
  });

  if (
    response.status === 401 &&
    (urlPath === "/events/new" || urlPath === `/events/${eventId}/edit`)
  ) {
    return redirect("/auth?mode=login");
  }

  if (response.status === 401) return null;

  const resData = await response.json();

  return resData;
};
