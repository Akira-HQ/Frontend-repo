"use client";

const ACTIVITY_DATA = [
  {
    user: "Grace Thompson",
    action: "Set WhatsApp Integration to Pending",
    date: "5 hours ago",
    status: "Pending",
  },
  {
    user: "Customer ID 456",
    action: "Abandoned Cart (Backpack)",
    date: "1 day ago",
    status: "Warning",
  },
  {
    user: "System Update",
    action: "RAG Index Sync Completed",
    date: "1 day ago",
    status: "Success",
  },
  {
    user: "Customer ID 101",
    action: "Opened Conversation Review Panel",
    date: "2 days ago",
    status: "Error",
  },
  {
    user: "User Admin",
    action: "Upgraded to Free Plan",
    date: "3 days ago",
    status: "Success",
  },
];

const RecentActivityTable: React.FC = () => (
  <div className="bg-[#0b0b0b] rounded-xl p-6 border border-gray-800 shadow-xl">
    <h3 className="text-lg font-bold text-white mb-6">
      Recent High-Impact Activity
    </h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-800">
        <thead className="bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              User/ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Action/Event
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {ACTIVITY_DATA.map((activity, index) => {
            const statusClass =
              activity.status === "Success"
                ? "bg-green-500/20 text-green-400"
                : activity.status === "Warning"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400";
            return (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {activity.user}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {activity.action}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {activity.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass} justify-center w-24`}
                  >
                    {activity.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default RecentActivityTable;
