"use client"

import Image from "next/image";
import imgtask from "@/assets/logo.png";
import FooterSau from "@/components/FooterSAU";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function Page() {
  //สร้าง router เพื่อใช้ในการ redirect ไปยังหน้าต่างๆ 
  const router = useRouter();

  //เอาข้อมูลที่ส่งมาซึ่งอยู่ใน useParams มาเก็บในตัวแปรเพื่อเอาไปใช้
  const { id } = useParams();

  //สร้าง state เพื่อ handle ข้อมูลบน component ที่จะทำงานด้วย
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [imageSelect, setImageSelect] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  //ดึงข้อมูลจาก database/table: task_tb มาแสดงที่ Component
  useEffect(()=>{
    //ฟังก์ชันดึงข้อมูล และกำหนดค่าให้กับ state
    const fetchData = async () =>{
      //ดึงข้อมูล
      const {data, error: fetchError} = await supabase.from('task_tb')
                                              .select("*")
                                              .eq("id",id)
                                              .single()
      if(fetchError){
        Swal.fire({
                icon: 'warning',
                title: 'คําเตือน',
                text: 'พบปัญหาในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง',
                confirmButtonText: 'ตกลง',
        })
        return;
      }                                              

      //กำหนดค่าให้กับ state
      setTitle(data?.title)
      setDetail(data?.detail)
      setIsCompleted(data?.is_completed)
      setImagePreview(data?.image_url)
    }

    //เรียกใช้ฟังก์ชัน
    fetchData()
  },[id])

  // ฟังก์ชันเลือกรูป
  const handleSelectPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImageSelect(file); //ตัวรูปที่เลือก เพื่อเอาไปอัปโหลด
      setImagePreview(URL.createObjectURL(file)); //ที่อยู่ของรูปที่เลือก เพื่อเอาไป preview
    }
  }

   // ฟังก์ชันบันทึกแก้ไขข้อมูล
  const handleUpdateClick = async () =>{
      //validate ui
      if(title === '' || detail === ''){
          Swal.fire({
            icon: 'warning',
            title: 'คําเตือน',
            text: 'กรุณาตรวจสอบข้อมูลที่ป้อน',
            confirmButtonText: 'ตกลง',
          })
          return
      }
  
      //อัปโหลดรูปไปที่ storage: task_bk และดึง url ของรูปมาด้วย เพื่อใช้ในการบันทึกลง database
      //ตรวจสอบว่ามีการแก้ไขรูปหรือไม่
      if(imageSelect){
        //มีการแก้ไขรูป
        //เปลี่ยนชื่อรูป เพื่อไม่ให้ชื่อซ้ํากัน
        const new_filename = `${Date.now()}_${imageSelect.name}`
        //อัปโหลด
        const {error: uploadError} = await supabase.storage
                                            .from('task_bk')
                                            .upload(new_filename, imageSelect)
        //เช็ค uploadError
        if(uploadError){
          Swal.fire({
            icon: 'warning',
            title: 'คําเตือน',
            text: 'พบปัญหาในการอัปโหลดรูปภาพ กรุณาลองใหม่อีกครั้ง',
            confirmButtonText: 'ตกลง',
          })
          return
        }
        //ดึง url ของรูป
        let image_url = '';
        const {data} = supabase.storage.from('task_bk').getPublicUrl(new_filename)
        image_url = data.publicUrl;
    
        //บันทึกข้อมูลไปที่ database/table: task_tb
        const {error: insertError} = await supabase.from('task_tb')
                                        .update({
                                          title: title,
                                          detail: detail,
                                          image_url: image_url,
                                          is_completed: isCompleted
                                        })
                                        .eq('id', id)
        //ตรวจสอบ insertError
        if(insertError){
          Swal.fire({
            icon: 'warning',
            title: 'คําเตือน',
            text: 'พบปัญหาในการบันทึกแก้ไขข้อมูล กรุณาลองใหม่อีกครั้ง',
            confirmButtonText: 'ตกลง',
          })
          return
        }
    
        //หลังจากอัปโหลด และบันทึกเรียบร้อยแล้ว จะแสดงข้อความแจ้ง และย้อนกลับไปหน้าหลัก /alltask
        //แสดงผลการทำงาน
        await Swal.fire({
            icon: 'success',
            title: 'ผลการทำงาน',
            text: 'บันทึกแก้ไขข้อมูลเรียบร้อยแล้ว',
            confirmButtonText: 'ตกลง',
        })
        //ย้อนกลับไปหน้า /alltask
        router.back() //หรือใช้ router.push('/alltask') ก็ได้

      }else{
        //ไม่มีการแก้ไขรูป
        //บันทึกข้อมูลไปที่ database/table: task_tb
        const {error: insertError} = await supabase.from('task_tb')
                                        .update({
                                          title: title,
                                          detail: detail,
                                          is_completed: isCompleted
                                        })
                                        .eq('id', id)
        //ตรวจสอบ insertError
        if(insertError){
          Swal.fire({
            icon: 'warning',
            title: 'คําเตือน',
            text: 'พบปัญหาในการบันทึกแก้ไขข้อมูล กรุณาลองใหม่อีกครั้ง',
            confirmButtonText: 'ตกลง',
          })
          return
        }
    
        //หลังจากอัปโหลด และบันทึกเรียบร้อยแล้ว จะแสดงข้อความแจ้ง และย้อนกลับไปหน้าหลัก /alltask
        //แสดงผลการทำงาน
        await Swal.fire({
            icon: 'success',
            title: 'ผลการทำงาน',
            text: 'บันทึกแก้ไขข้อมูลเรียบร้อยแล้ว',
            confirmButtonText: 'ตกลง',
        })
        //ย้อนกลับไปหน้า /alltask
        router.back() //หรือใช้ router.push('/alltask') ก็ได้
        
      }      
    }

  return (
    <>
      {/* ส่วนของหน้าต่างหลัก */}
      <div className="w-3/4 mx-auto mt-20 flex flex-col items-center border border-gray-100
                      rounded-lg shadow-xl p-10">
             {/* ส่วนของหัวเพจ */}
            <Image src={imgtask} alt="imgtask" width={75} height={75} />
            <h1 className="text-xl">Manage Task App</h1>
            <h1 className="text-lg">แก้ไขงาน</h1>

            {/* ส่วนของการป้อนและเลือกข้อมูล */}
            <div className="w-full flex flex-col mt-5">
                <label>งานที่ทำ</label>
                <input  value={title} onChange={(e) => setTitle(e.target.value)}
                        type="text" className="w-full border border-gray-400 rounded" />

                <label className="mt-3">รายละเอียดงาน</label>
                <textarea   value={detail} onChange={(e) => setDetail(e.target.value)}
                            className="w-full border border-gray-400 rounded" rows={3}></textarea>

                <label  className="mt-3">สถานะงาน</label>
                <select value={isCompleted == true ? '1' : '0'}
                        onChange={(e)=>setIsCompleted(e.target.value === '1')}
                        className="w-full border border-gray-400 rounded p-1">
                    <option value="1">✅ เสร็จ</option>
                    <option value="0">❌ ยังไม่เสร็จ</option>
                </select>

                <label  className="mt-3">รูป</label>
                <input type="file" id="taskpicture" className="hidden" 
                        onChange={handleSelectPicture}/>
                <label htmlFor="taskpicture" 
                        className="w-50 bg-green-600 p-2 rounded text-center
                                text-white cursor-pointer hover:bg-green-700">
                    คลิกเพื่อเลือกรูป
                </label>
                {/* ส่วนของการ preview รูปที่เลือก */}
                {
                  imagePreview && (
                    <div className="mt-3">
                      <Image src={imagePreview} alt="preview" width={200} height={200} />
                    </div>
                  )
                }
            </div>

            {/* ส่วนของปุ่มบันทึก */}
            <button   onClick={handleUpdateClick}
                      className="w-full p-2 bg-blue-600 mt-3 rounded text-white
                               cursor-pointer hover:bg-blue-700">
                บันทึกแก้ไขงาน
            </button>

            {/* ลิงค์กลับไปหน้า /alltask */}
            <Link href="/alltask" className="mt-3">- กลับไปหน้าหลัก -</Link>
      </div>

      {/* ส่วนของ FooterSAU */}
      <FooterSau />
    </>
  );
}