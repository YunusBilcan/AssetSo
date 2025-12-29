
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ICONS } from '../constants';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: User) => void;
  onDeleteUser: (id: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onAddUser, onDeleteUser }) => {
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>(UserRole.VIEWER);

  const handleAdd = () => {
    if (!newName.trim()) return;
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      role: newRole
    };
    onAddUser(newUser);
    setNewName('');
    setNewRole(UserRole.VIEWER);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
          <p className="text-gray-500">Sistem yetkililerini ve erişim rollerini yönetin</p>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden p-8 space-y-6">
        <h2 className="text-lg font-bold text-gray-900">Yeni Kullanıcı Ekle</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ad Soyad</label>
            <input 
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 bg-white text-black outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              placeholder="Kullanıcı adı..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Yetki Rolü</label>
            <select 
              value={newRole}
              onChange={e => setNewRole(e.target.value as UserRole)}
              className="w-full p-3 rounded-xl border border-gray-200 bg-white text-black font-bold outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value={UserRole.ADMIN}>ADMIN (Tam Yetki)</option>
              <option value={UserRole.MANAGER}>MANAGER (Düzenleme)</option>
              <option value={UserRole.VIEWER}>VIEWER (Sadece İzleme)</option>
            </select>
          </div>
          <button 
            onClick={handleAdd}
            className="bg-indigo-600 text-white p-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
          >
            <ICONS.Plus /> Kullanıcı Oluştur
          </button>
        </div>

        <div className="space-y-3 pt-6">
          <h2 className="text-lg font-bold text-gray-900">Kayıtlı Kullanıcılar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map(u => (
              <div key={u.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-indigo-100 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{u.name}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${
                      u.role === UserRole.ADMIN ? 'text-purple-600' : 
                      u.role === UserRole.MANAGER ? 'text-indigo-600' : 'text-gray-400'
                    }`}>{u.role}</p>
                  </div>
                </div>
                {u.id !== 'u1' && (
                  <button 
                    onClick={() => onDeleteUser(u.id)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <ICONS.Trash />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
