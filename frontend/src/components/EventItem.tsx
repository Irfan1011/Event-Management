import { Link, useSubmit, useRouteLoaderData } from "react-router";

import classes from "./EventItem.module.css";

type TEventItem = {
  event: { title: string; image: string; date: string; description: string };
};

function EventItem({ event }: TEventItem) {
  const routeLoaderData = useRouteLoaderData("root");
  const submit = useSubmit();

  function startDeleteHandler() {
    const proceed = window.confirm("Are you sure?");

    if (proceed) {
      submit(null, { method: "delete" });
    }
  }

  return (
    <article className={classes.event}>
      <img src={event.image} alt={event.title} />
      <h1>{event.title}</h1>
      <time>{event.date}</time>
      <p>{event.description}</p>
      {routeLoaderData && (
        <menu className={classes.actions}>
          <Link to="edit">Edit</Link>
          <button onClick={startDeleteHandler}>Delete</button>
        </menu>
      )}
    </article>
  );
}

export default EventItem;
