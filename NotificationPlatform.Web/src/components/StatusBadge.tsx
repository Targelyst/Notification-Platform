const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: { [key: string]: { color: string; text: string } } = {
    completed: { color: "bg-emerald-500/20", text: "text-emerald-400" },
    "in-progress": { color: "bg-amber-500/20", text: "text-amber-400" },
    "attention-needed": { color: "bg-rose-500/20", text: "text-rose-400" },
    new: { color: "bg-purple-500/20", text: "text-purple-400" },
    updated: { color: "bg-sky-500/20", text: "text-sky-400" },
    recommended: { color: "bg-cyan-500/20", text: "text-cyan-400" },
  };

  return (
    <div
      className={`px-2 py-1 rounded-md ${statusConfig[status].color} ${statusConfig[status].text} text-xs font-medium capitalize`}
    >
      {status.replace("-", " ")}
    </div>
  );
};

export default StatusBadge;