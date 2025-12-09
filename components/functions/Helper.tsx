import { CheckCircle, LucideIcon, XCircle } from "lucide-react";

const InputField: React.FC<{
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: LucideIcon;
  placeholder?: string;
}> = ({ label, type, value, onChange, icon: Icon, placeholder }) => (
  <div className="relative">
    <label className="text-sm font-medium text-gray-400 block mb-1">
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
        className="w-full p-3 pl-10 mt-1 text-gray-100 rounded-xl bg-gray-700/50 border border-gray-700 focus:border-[#00A7FF] focus:ring-1 focus:ring-[#00A7FF] transition duration-200 shadow-inner"
        required
      />
    </div>
  </div>
);

const PasswordRequirement: React.FC<{ text: string; passed: boolean }> = ({
  text,
  passed,
}) => (
  <li
    className={`flex items-center text-sm ${passed ? "text-red-400" : "text-green-400"}`}
  >
    {passed ? (
      <XCircle className="w-4 h-4 mr-2" />
    ) : (
      <CheckCircle className="w-4 h-4 mr-2" />
    )}
    {text}
  </li>
);

const PlatformButton: React.FC<{
  icon: LucideIcon;
  name: string;
  onClick: () => void;
  platform: string;
}> = ({ icon: Icon, name, onClick, platform }) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center p-6 w-32 h-32 md:w-40 md:h-40 rounded-xl transition duration-300
      ${
        platform === name.toLowerCase()
          ? "border-2 border-[#A500FF] bg-gray-700/80 shadow-[0_0_20px_rgba(165,0,255,0.6)]"
          : "border border-gray-700 bg-gray-800/50 hover:border-[#00A7FF] hover:shadow-md"
      }
    `}
  >
    <Icon
      className={`w-10 h-10 mb-2 ${platform === name.toLowerCase() ? "text-[#00A7FF]" : "text-gray-400"}`}
    />
    <span className="text-white font-semibold">{name}</span>
  </button>
);

export { PlatformButton, InputField, PasswordRequirement };
