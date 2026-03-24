import logoimg from "@/assets/logo.png";
import FooterSAU from "@/components/FooterSAU";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div
        className="w-3/5 mt-20 p-10 shadow-xl mx-auto
                      border border-gray-400 rounded-xl
                      flex flex-col justify-center items-center"
      >
        {/* แสดงรูปจาก assets ในโปรเจ็กต์ */}
        <Image src={logoimg} alt="logo" width={100} height={100} />
        {/* แสดงชื่อแอปฯ + การทำงาน */}
        <h1 className="mt-5 text-2xl font-bold text-gray-700">
          Manage Task App
        </h1>
        <h1 className="mt-3 text-lg text-gray-700">แก้ไขงาน</h1>

        {/* ส่วนของการเพิ่มงาน และรายละเอียดงาน */}
        <div className="w-full flex flex-col mt-5">
          <h1>ชื่องาน</h1>
          <input
            type="text"
            className="p-2 border border-gray-700 rounded mt-1 mb-2"
          />
          <h1>รายละเอียดงาน</h1>
          <textarea
            className="p-2 border border-gray-700 rounded mt-1 mb-3"
            rows={4}
          ></textarea>
        </div>

        {/* ส่วนเลือกรูป + แสดงรูปที่อัปโหลด */}
        <div className="w-full flex flex-col mt-5">
          <h1>อัปโหลดรูป</h1>
          <input
            id="selectImage"
            type="file"
            accept="image/*"
            className="hidden"
          />
          <label
            htmlFor="selectImage"
            className="py-2 px-4 cursor-pointer bg-blue-600 hover:bg-blue-800 text-white rounded mt-1 mb-2 w-30 text-center"
          >
            เลือกรูปภาพ
          </label>
          {/* แสดงรูปที่อัปโหลด */}
        </div>
        {/* ส่วนของสถานะงาน */}
        <div className="w-full flex flex-col mt-5">
          <h1>สถานะงาน</h1>
          <select className="p-2 border border-gray-700 rounded mt-1 mb-2">
            <option value="1">✅เสร็จแล้ว✅</option>
            <option value="0">❌ยังไม่เสร็จ❌</option>
          </select>
        </div>
        {/* ปุ่มบันทึก */}
        <button className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded mt-5 cursor-pointer">
          บันทึกงานใหม่
        </button>
        {/* ย้อนกลับไปหน้าแสดงงานทั้งหมด /showalltask*/}
        <Link
          href="/showalltask"
          className="mt-3 text-blue-500 hover:text-blue-700 underline"
        >
          กลับไปหน้าแสดงงานทั้งหมด
        </Link>
      </div>
      {/* แสดง Footer */}
      <FooterSAU />
    </>
  );
}