import { useAuth } from "../../../context/AuthContext";

function RFQCollaboratorsCard() {

  const { user } = useAuth();

  console.log("CURRENT USER:", user);

  // Safe role handling
  const role = user?.role?.trim().toUpperCase();

  // RBAC
  const isAdmin = role === "ADMIN";
  const isMerchandiser = role === "MERCHANDISER";

  const canManage = isAdmin || isMerchandiser;

  // Display name
  const displayName =
    user?.userName ||
    user?.email?.split("@")[0] ||
    "User";

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="bg-[#11151D] border border-[#2A3142] rounded-3xl p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-6">

        <h2 className="text-white text-xl font-semibold">
          Collaborators
        </h2>

        {/* ONLY ADMIN + MERCHANDISER */}
        {canManage && (
          <button
            className="
              text-orange-400
              hover:text-orange-300
              transition-all
              text-sm
              font-medium
            "
          >
            + Collaborate
          </button>
        )}

      </div>

      {/* USER INFO */}
      <div className="flex items-center gap-4">

        <div
          className="
            w-12
            h-12
            rounded-full
            bg-gradient-to-br
            from-orange-400
            to-orange-600
            flex
            items-center
            justify-center
            text-white
            font-semibold
          "
        >
          {initial}
        </div>

        <div>

          <p className="text-white font-medium capitalize">
            {displayName}
          </p>

          <p
            className="
              text-zinc-500
              text-sm
              uppercase
              tracking-wider
            "
          >
            {role || "MEMBER"}
          </p>

        </div>

      </div>

    </div>
  );
}

export default RFQCollaboratorsCard;