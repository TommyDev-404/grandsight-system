
export default function Spinner({ size, spinnerColor }) {
      const color = {
            blue: 'border-blue-500'
      };

      return (
            <div className={`relative inset-0 rounded-full border-2 ${color[spinnerColor]} border-b-white border-r-white border-l-white animate-spin w-${size} h-${size} `} />
      );
}
