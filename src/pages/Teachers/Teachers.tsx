import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashBinIcon, UserIcon } from "../../icons"; // Sizning ikonlaringizdan
import { CheckCircleIcon, GroupIcon } from '../../icons';

// Static mock data
const mockTeachers = [
  { id: 1, name: "Abdullaev Ahmad", subject: "Frontend", phone: "+998 90 123 45 67", email: "ahmad@school.uz", groups: 5, status: "Faol" },
  { id: 2, name: "Karimova Gulnoza", subject: "Backend", phone: "+998 91 234 56 78", email: "gulnoza@school.uz", groups: 4, status: "Faol" },
  { id: 3, name: "Oripov Sardor", subject: "Python", phone: "+998 99 345 67 89", email: "sardor@school.uz", groups: 3, status: "Ta'tilda" },
  { id: 4, name: "Saidova Madina", subject: "Frontend", phone: "+998 93 456 78 90", email: "madina@school.uz", groups: 6, status: "Faol" },
  { id: 5, name: "To'rayev Botir", subject: "Java", phone: "+998 97 567 89 01", email: "botir@school.uz", groups: 2, status: "Faol" },
  // Qo'shimcha ma'lumotlar...
];

const Teachers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Qidiruv filtri
  const filteredTeachers = mockTeachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.phone.includes(searchTerm)
  );

  // Pagination
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-3 sm:p-2 lg:p-0">
      {/* Sarlavha va statistika kartalari */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">O'qituvchilar</h1>
      </div>

      {/* Qidiruv va tugma */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <CheckCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Ism, fan yoki telefon bo'yicha qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <button className="flex items-center gap-2 bg-[#032E15] text-white px-5 py-3 rounded-lg hover:bg-[#024012] transition">
          <PlusIcon className="w-5 h-5" />
          Yangi o'qituvchi qo'shish
        </button>
      </div>

      {/* Jadval */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">O'qituvchi</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guruh Nomi</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guruhlar</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Holati</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                        <div className="text-sm text-gray-500">{teacher.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{teacher.subject}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{teacher.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{teacher.groups} ta</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full ${teacher.status === "Faol" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {teacher.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button className="text-brand-600 hover:text-brand-800 mr-3">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <TrashBinIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, filteredTeachers.length)} / {filteredTeachers.length} ta
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Oldingi
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg ${currentPage === page ? "bg-[#032E15] text-white" : "border border-gray-300 hover:bg-gray-50"}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Keyingi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teachers;