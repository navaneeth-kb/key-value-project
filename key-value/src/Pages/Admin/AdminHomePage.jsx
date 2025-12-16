import React, { useEffect, useState } from "react";
import {
  HomeIcon,
  CurrencyRupeeIcon,
  WrenchScrewdriverIcon,
  UserIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import hi from "../../assets/Home/hi.svg";

const AdminHomePage = () => {
  /* ================= BASIC ================= */
  const [activeTab, setActiveTab] = useState("tenants");
  const [adminName, setAdminName] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= TENANTS ================= */
  const [tenants, setTenants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [showAddTenant, setShowAddTenant] = useState(false);
  const [newTenant, setNewTenant] = useState({
    id: "",
    name: "",
    contact: "",
    room: "",
  });

  /* ================= RENT ================= */
  const [rentMap, setRentMap] = useState({});
  const [rentSearchQuery, setRentSearchQuery] = useState("");
  const [showRentModal, setShowRentModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);

  // Global month add
  const [globalYear, setGlobalYear] = useState("");
  const [globalMonth, setGlobalMonth] = useState("");
  const [globalAmount, setGlobalAmount] = useState("");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const adminSnap = await getDoc(doc(db, "organiser", user.email));
      setAdminName(adminSnap.exists() ? adminSnap.data().name : "Admin");

      const tenantsSnap = await getDocs(collection(db, "tenants"));
      setTenants(
        tenantsSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );

      const rentSnap = await getDocs(collection(db, "rent"));
      const rentData = {};
      rentSnap.forEach((d) => {
        rentData[d.id] = d.data();
      });
      setRentMap(rentData);

      setLoading(false);
    });

    return () => unsub();
  }, []);

  /* ================= ADD TENANT ================= */
  const handleAddTenant = async () => {
    if (!newTenant.id || !newTenant.name || !newTenant.contact || !newTenant.room)
      return;

    await setDoc(doc(db, "tenants", newTenant.id), {
      name: newTenant.name,
      contact: Number(newTenant.contact),
      room: newTenant.room,
    });

    setTenants((prev) => [...prev, newTenant]);
    setNewTenant({ id: "", name: "", contact: "", room: "" });
    setShowAddTenant(false);
  };

  /* ================= RENT ================= */
  const openRentModal = (tenant) => {
    setSelectedTenant(tenant);
    setShowRentModal(true);
  };

  const addMonthForAll = async () => {
    if (!globalYear || !globalMonth || !globalAmount) return;

    const key = `${globalYear}-${globalMonth}`;
    const amount = Number(globalAmount);

    for (const t of tenants) {
      await setDoc(
        doc(db, "rent", t.id),
        { [key]: { pendingDue: amount } },
        { merge: true }
      );
    }

    setRentMap((prev) => {
      const updated = { ...prev };
      tenants.forEach((t) => {
        updated[t.id] = {
          ...updated[t.id],
          [key]: { pendingDue: amount },
        };
      });
      return updated;
    });

    setGlobalYear("");
    setGlobalMonth("");
    setGlobalAmount("");
  };

  /* ================= FILTERS ================= */
  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.room?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRentTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(rentSearchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(rentSearchQuery.toLowerCase())
  );

  /* ================= UI ================= */
  return (
    <div className="w-full min-h-screen bg-[#F6FCF7] pb-20">
      {/* HERO */}
      <div className="relative max-w-3xl mx-auto px-4 pt-6 mb-6">
        <img src={hi} className="w-full rounded-2xl" />
        <div className="absolute top-10 left-6 text-white">
          <h1 className="text-xl font-semibold">Welcome back</h1>
          <h2 className="text-3xl font-extrabold">{adminName}</h2>
        </div>
      </div>

      {/* ================= TENANTS TAB ================= */}
      {activeTab === "tenants" && (
        <>
          <div className="max-w-3xl mx-auto px-4 flex gap-2 mb-4">
            <input
              placeholder="Search tenants (name / id / room)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 border rounded-lg"
            />
            <button
              onClick={() => setShowAddTenant(true)}
              className="px-4 py-3 bg-blue-500 text-white rounded-lg flex gap-1"
            >
              <PlusIcon className="h-5 w-5" /> Add
            </button>
          </div>

          <div className="max-w-3xl mx-auto px-4 space-y-4">
            {filteredTenants.map((t) => (
              <div key={t.id} className="bg-white p-4 rounded-xl shadow">
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-sm text-gray-600">ID: {t.id}</p>
                <p className="text-sm text-gray-600">Contact: {t.contact}</p>
                <p className="text-sm text-gray-600">Room: {t.room}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ================= RENT TAB ================= */}
      {activeTab === "rent" && (
        <>
          <div className="max-w-3xl mx-auto px-4 mb-3">
            <input
              placeholder="Search tenant (name / id)..."
              value={rentSearchQuery}
              onChange={(e) => setRentSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>

          <div className="max-w-3xl mx-auto px-4 mb-4 bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold mb-2">Add Rent for All Tenants</h3>
            <div className="flex gap-2 mb-2">
              <input
                placeholder="YYYY"
                className="w-20 px-2 py-1 border rounded"
                value={globalYear}
                onChange={(e) => setGlobalYear(e.target.value)}
              />
              <input
                placeholder="MM"
                className="w-16 px-2 py-1 border rounded"
                value={globalMonth}
                onChange={(e) => setGlobalMonth(e.target.value)}
              />
              <input
                placeholder="Amount"
                type="number"
                className="w-32 px-2 py-1 border rounded"
                value={globalAmount}
                onChange={(e) => setGlobalAmount(e.target.value)}
              />
            </div>
            <button
              onClick={addMonthForAll}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Month for All
            </button>
          </div>

          <div className="max-w-3xl mx-auto px-4 space-y-4">
            {filteredRentTenants.map((t) => (
              <div
                key={t.id}
                onClick={() => openRentModal(t)}
                className="bg-white p-4 rounded-xl shadow cursor-pointer"
              >
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-sm text-gray-600">Room: {t.room}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ================= RENT MODAL ================= */}
      {showRentModal && selectedTenant && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Rent – {selectedTenant.name}
            </h3>

            {Object.entries(rentMap[selectedTenant.id] || {}).map(
              ([month, data]) => {
                const due = data?.pendingDue ?? 0;
                return (
                  <div
                    key={month}
                    className="flex justify-between items-center mb-3"
                  >
                    <span>{month}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${
                          due > 0 ? "text-red-500" : "text-green-600"
                        }`}
                      >
                        {due > 0 ? `Pending ₹${due}` : "Paid"}
                      </span>
                      {due > 0 && (
                        <button
                          onClick={async () => {
                            await setDoc(
                              doc(db, "rent", selectedTenant.id),
                              { [month]: { pendingDue: 0 } },
                              { merge: true }
                            );
                            setRentMap((prev) => ({
                              ...prev,
                              [selectedTenant.id]: {
                                ...prev[selectedTenant.id],
                                [month]: { pendingDue: 0 },
                              },
                            }));
                          }}
                          className="px-2 py-1 text-xs bg-green-500 text-white rounded"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </div>
                );
              }
            )}

            <div className="text-right mt-4">
              <button
                onClick={() => setShowRentModal(false)}
                className="px-4 py-2 border rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD TENANT MODAL ================= */}
      {showAddTenant && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm">
            <input
              placeholder="Tenant ID"
              className="w-full mb-2 px-3 py-2 border rounded"
              value={newTenant.id}
              onChange={(e) =>
                setNewTenant({ ...newTenant, id: e.target.value })
              }
            />
            <input
              placeholder="Name"
              className="w-full mb-2 px-3 py-2 border rounded"
              value={newTenant.name}
              onChange={(e) =>
                setNewTenant({ ...newTenant, name: e.target.value })
              }
            />
            <input
              placeholder="Contact"
              type="number"
              className="w-full mb-2 px-3 py-2 border rounded"
              value={newTenant.contact}
              onChange={(e) =>
                setNewTenant({ ...newTenant, contact: e.target.value })
              }
            />
            <input
              placeholder="Room Number"
              className="w-full mb-4 px-3 py-2 border rounded"
              value={newTenant.room}
              onChange={(e) =>
                setNewTenant({ ...newTenant, room: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddTenant(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTenant}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= BOTTOM NAV ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white h-16 border-t flex justify-around items-center">
        <button
          onClick={() => setActiveTab("tenants")}
          className={`flex flex-col items-center ${
            activeTab === "tenants" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs">Tenants</span>
        </button>

        <button
          onClick={() => setActiveTab("rent")}
          className={`flex flex-col items-center ${
            activeTab === "rent" ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <CurrencyRupeeIcon className="h-6 w-6" />
          <span className="text-xs">Rent</span>
        </button>

        <button className="flex flex-col items-center text-gray-500">
          <WrenchScrewdriverIcon className="h-6 w-6" />
          <span className="text-xs">Maintenance</span>
        </button>

        <button className="flex flex-col items-center text-gray-500">
          <UserIcon className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default AdminHomePage;
