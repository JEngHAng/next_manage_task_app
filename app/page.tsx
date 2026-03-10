export default function Page() {
  return (
    <>
      <div className="w-3/5 mt-10 p-10 shadow-xl mx-auto border-gray-400 rounded-xl flex flex-col justify-center items-center">
        {/* แสดงรูปจาก Internet */}
        <img
          src="https://cdn-icons-png.flaticon.com/128/15757/15757011.png"
          alt="Image"
          width={150}
          height={150}
        />
        {/* แสดงชื่อ app */}
        <h1 className="mt-5 text-2xl font-bold text-gray-700">Manage Task App</h1>

        <h1 className="mt-5 text-lg font-bold text-gray-700">บริหารจัดการงานที่ทำ</h1>

        {/* ป้อน Secure code สำหรับเข้าใช้งาน */}
        <input type="text" className="p-3 border border-gray-400 rounded mt-5 w-1/2"/>

        {/* ปุ่มเข้าใช้งาน */}
        <button className="mt-5 w-1/2 bg-blue-600 py-3 text-white rounded hover:bg-blue-700 cursor-pointer">เข้าใช้งาน 😒</button>
      </div>
    </>
  );
}
