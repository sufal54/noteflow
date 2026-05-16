"use client";

import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Note = {
  _id: string;
  title: string;
  owner: {
    _id: string;
    email: string;
  };
  sharedWith: {
    _id: string;
    email: string;
  }[];
  content: string;
  createdAt?: string;
};

type User = {
  _id: string;
  email: string;
  createdAt?: string;
};

export default function Notes() {
  const [user, setUser] = useState<User | null>(null);

  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [shareNote, setShareNote] = useState<Note | null>(null);
  const [email, setEmail] = useState("");

  const router = useRouter();

  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  useEffect(() => {
    const token = getToken();

    // If no token → redirect to register
    if (!token) {
      router.push("/register");
    }
  }, [router]);

  async function deleteShareNotes(targetUserId: string) {
    const token = getToken();

    if (!shareNote) {
      return;
    }

    const res = await fetch(
      `${baseUrl}/notes/${shareNote._id}/share/${targetUserId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const updated = await res.json();

    setShareNote(updated);
    setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)));
  }

  async function getUser() {
    const token = getToken();

    const res = await fetch(`${baseUrl}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    setUser(data);
  }

  async function shareNoteApi(noteId: string, email: string) {
    const token = getToken();

    await fetch(`${baseUrl}/notes/${noteId}/share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ share_with_email: email }),
    });

    setEmail("");

    const res = await fetch(`${baseUrl}/notes`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setNotes(data);

    if (shareNote == null) {
      return;
    }

    const updated = data.find((n: any) => n._id === shareNote._id);
    if (updated) setShareNote(updated);
  }

  async function updateNote() {
    if (!editingNote) return;

    const token = getToken();

    setLoading(true);

    await fetch(`${baseUrl}/notes/${editingNote._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: editTitle,
        content: editContent,
      }),
    });

    setEditingNote(null);
    fetchNotes();

    setLoading(false);
  }

  async function fetchNotes() {
    const token = getToken();
    console.log(token);
    const res = await fetch(`${baseUrl}/notes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setNotes(data);
  }

  async function createNote() {
    if (!title || !content) return;

    const token = localStorage.getItem("token");

    await fetch(`${baseUrl}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    setTitle("");
    setContent("");

    fetchNotes();
  }

  async function deleteNote(id: string) {
    const token = localStorage.getItem("token");

    await fetch(`${baseUrl}/notes/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchNotes();
  }

  useEffect(() => {
    fetchNotes();
    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            My Notes
          </h1>
          <p className="text-slate-400 mt-3">
            Create and manage your notes beautifully ✨
          </p>
        </div>

        {/* Create Note Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-2xl mb-10">
          <h2 className="text-2xl font-semibold mb-5">Create New Note</h2>

          <div className="grid gap-4">
            <input
              value={title}
              placeholder="Enter title..."
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl bg-slate-900/70 border border-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />

            <textarea
              value={content}
              placeholder="Write your note..."
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full rounded-xl bg-slate-900/70 border border-slate-700 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500 transition resize-none"
            />

            <button
              onClick={createNote}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 px-6 py-3 rounded-xl font-semibold shadow-lg"
            >
              + Create Note
            </button>
          </div>
        </div>

        {shareNote && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="w-full max-w-lg bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-green-300 mb-4">
                Share Note
              </h2>

              {/* Already shared users */}
              <p className="text-sm text-slate-400 mb-2">Shared with:</p>

              <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                {shareNote.sharedWith?.length === 0 && (
                  <p className="text-slate-500 text-sm">No users yet</p>
                )}

                {shareNote.sharedWith?.map((u: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 bg-slate-900/60 hover:bg-slate-800/60 transition px-4 py-2 rounded-xl border border-slate-700/50"
                  >
                    {/* Email */}
                    <span className="text-sm text-slate-200 truncate">
                      {u.email}
                    </span>

                    {/* Remove button */}
                    <button
                      onClick={() => deleteShareNotes(u._id)}
                      className="text-xs font-medium px-3 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Add new email */}
              <div className="flex gap-2 mb-4">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email..."
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-900/70 border border-slate-700"
                />

                <button
                  onClick={() => {
                    shareNoteApi(shareNote._id, email);
                    setEmail("");
                  }}
                  className="px-4 py-2 rounded-xl bg-green-500 text-black font-semibold"
                >
                  Add
                </button>
              </div>

              {/* Close */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShareNote(null)}
                  className="px-4 py-2 rounded-xl border border-white/20"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {editingNote && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="w-full max-w-lg bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-cyan-300 mb-4">
                Edit Note ?
              </h2>

              {/* Title */}
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full mb-4 px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-700 outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Title"
              />

              {/* Content */}
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={6}
                className="w-full mb-4 px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-700 outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                placeholder="Content"
              />

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingNote(null)}
                  className="px-4 py-2 rounded-xl border border-white/20 hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  onClick={updateNote}
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:scale-105 transition"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notes Grid */}
        {notes.length <= 0 ? (
          <div className="text-center text-slate-400 mt-20">
            <p className="text-2xl">No notes yet 📝</p>
            <p className="mt-2">Create your first beautiful note.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((n) => (
              <div
                key={n._id}
                className="group bg-white/10 border border-white/10 backdrop-blur-lg rounded-2xl p-5 shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-cyan-300 break-words">
                      {n.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1">
                      owner {n.owner?.email}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteNote(n._id)}
                    className="opacity-70 group-hover:opacity-100 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white px-3 py-1 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>

                {/* Content */}
                <p className="text-slate-300 mt-4 whitespace-pre-wrap leading-relaxed">
                  {n.content}
                </p>

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
                  <span>
                    🕒{" "}
                    {n.createdAt
                      ? new Date(n.createdAt).toLocaleString()
                      : "Just now"}
                  </span>

                  {user?._id === n.owner._id && (
                    <div className="flex gap-3">
                      {/* Edit */}
                      <button
                        onClick={() => {
                          setEditingNote(n);
                          setEditTitle(n.title);
                          setEditContent(n.content);
                        }}
                        className="hover:text-cyan-400 transition"
                      >
                        Edit
                      </button>
                      {/* Share */}
                      <button
                        onClick={() => setShareNote(n)}
                        className="hover:text-green-400 transition"
                      >
                        Share
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
