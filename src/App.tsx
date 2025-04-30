import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import {
  useMutation,
  useQuery,
  Authenticated,
  Unauthenticated,
  useConvexAuth,
} from "convex/react";
import { api } from "../convex/_generated/api";
import { useAuth } from "@workos-inc/authkit-react";

// For demo purposes. In a real app, you'd have real user data.
const NAME = getOrSetFakeName();

export default function App() {
  const { signIn } = useAuth();
  const { isLoading, isAuthenticated, ...rest } = useConvexAuth();
  console.log("Auth state:", { isLoading, isAuthenticated, ...rest });
  return (
    <main className="chat">
      <Authenticated>
        <Content />
      </Authenticated>
      <Unauthenticated>
        <h1>YOU ARE NOT AUTHENTICATED</h1>
        <button onClick={() => signIn()}>Sign In</button>
      </Unauthenticated>
    </main>
  );
}

function Content() {
  const sendMessage = useMutation(api.chat.sendMessage);
  const messages = useQuery(api.chat.getMessages);
  const [newMessageText, setNewMessageText] = useState("");

  useEffect(() => {
    // Make sure scrollTo works on button click in Chrome
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 0);
  }, [messages]);
  return (
    <>
      <header>
        <h1>Convex Chat</h1>
        <p>
          Connected as <strong>{NAME}</strong>
        </p>
      </header>
      {messages?.map((message) => (
        <article
          key={message._id}
          className={message.user === NAME ? "message-mine" : ""}
        >
          <div>{message.user}</div>

          <p>{message.body}</p>
        </article>
      ))}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await sendMessage({ user: NAME, body: newMessageText });
          setNewMessageText("");
        }}
      >
        <input
          value={newMessageText}
          onChange={async (e) => {
            const text = e.target.value;
            setNewMessageText(text);
          }}
          placeholder="Write a message…"
          autoFocus
        />
        <button type="submit" disabled={!newMessageText}>
          Send
        </button>
      </form>
    </>
  );
}

function getOrSetFakeName() {
  const NAME_KEY = "tutorial_name";
  const name = sessionStorage.getItem(NAME_KEY);
  if (!name) {
    const newName = faker.person.firstName();
    sessionStorage.setItem(NAME_KEY, newName);
    return newName;
  }
  return name;
}
