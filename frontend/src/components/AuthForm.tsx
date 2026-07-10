import {
  Form,
  useSearchParams,
  Link,
  useActionData,
  useNavigation,
} from "react-router";

import classes from "./AuthForm.module.css";

type TErrors = { [key: string]: string };

function AuthForm() {
  const data = useActionData<TErrors>();
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();

  const isLogin = searchParams.get("mode") === "login";
  const isSubmitting = navigation.state === "submitting";

  return (
    <>
      <article className={classes.article}>
        <h3>Your Dummy Account For Testing Purpose</h3>
        <span>email: tes@gmail.com</span>
        <span>password: 121212</span>
      </article>

      <Form method="post" className={classes.form}>
        {data && data.errors && (
          <>
            <p>{data.message}</p>
            <ul>
              {Object.values(data.errors).map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          </>
        )}
        <h1>{isLogin ? "Log in" : "Create a new user"}</h1>
        <p>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
        </p>
        <p>
          <label htmlFor="image">Password</label>
          <input id="password" type="password" name="password" required />
        </p>
        <div className={classes.actions}>
          <Link to={`?mode=${isLogin ? "signup" : "login"}`}>
            {isLogin ? "Create new user" : "Login"}
          </Link>
          <button disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Save"}
          </button>
        </div>
      </Form>
    </>
  );
}

export default AuthForm;
