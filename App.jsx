import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  CheckCircle2, 
  Share2, 
  Users, 
  Sparkles, 
  PieChart as PieChartIcon, 
  Layers, 
  ChevronRight, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  RefreshCw,
  X,
  Check,
  UserPlus,
  Copy,
  ExternalLink
} from 'lucide-react';

// Default Family Members
const DEFAULT_MEMBERS = [
  { id: 'dad', name: 'Μπαμπάς', role: 'Γονέας', color: 'bg-blue-500 text-white', badge: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'mom', name: 'Μαμά', role: 'Γονέας', color: 'bg-rose-500 text-white', badge: 'bg-rose-100 text-rose-800 border-rose-300' },
  { id: 'child1', name: 'Παιδί 1 (Αλέξανδρος)', role: 'Παιδί', color: 'bg-amber-500 text-white', badge: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'child2', name: 'Παιδί 2 (Μαρία)', role: 'Παιδί', color: 'bg-purple-500 text-white', badge: 'bg-purple-100 text-purple-800 border-purple-300' }
];

// Available categories with visual tags
const CATEGORIES = [
  { id: 'Supermarket', label: 'Supermarket / Τρόφιμα', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'Fuel & Transport', label: 'Fuel & Transport / Καύσιμα', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'Dining & Coffee', label: 'Dining & Coffee / Εστίαση', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  { id: 'Business & Office', label: 'Business & Office / Γραφείο', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'Health & Pharmacy', label: 'Health & Pharmacy / Φαρμακείο', color: 'bg-teal-100 text-teal-800 border-teal-300' },
  { id: 'Utilities & Bills', label: 'Utilities & Bills / Λογαριασμοί', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'Education & Hobbies', label: 'Education & Hobbies / Σχολικά', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { id: 'Entertainment & Leisure', label: 'Entertainment & Leisure / Ψυχαγωγία', color: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300' },
  { id: 'Other Expenses', label: 'Other Expenses / Διάφορα', color: 'bg-gray-100 text-gray-800 border-gray-300' }
];

// Sample Receipt Data Presets
const INITIAL_RECEIPTS = [
  {
    id: 'rec_1',
    merchant: 'AB Vassilopoulos Supermarket',
    date: '2026-11-02',
    category: 'Supermarket',
    memberId: 'mom',
    memberName: 'Μαμά',
    total: 48.65,
    tax: 6.20,
    paymentMethod: 'Card (Visa ****4821)',
    status: 'Verified',
    notes: 'Εβδομαδιαία ψώνια σπιτιού',
    items: [
      { description: 'Fresh Milk 1L', price: 1.65, category: 'Supermarket' },
      { description: 'Organic Eggs 10pk', price: 3.80, category: 'Supermarket' },
      { description: 'Olive Oil 1L Extra Virgin', price: 11.50, category: 'Supermarket' },
      { description: 'Greek Yogurt 1kg', price: 4.20, category: 'Supermarket' }
    ]
  },
  {
    id: 'rec_2',
    merchant: 'EKO Gas Station',
    date: '2026-11-04',
    category: 'Fuel & Transport',
    memberId: 'dad',
    memberName: 'Μπαμπάς',
    total: 55.00,
    tax: 10.65,
    paymentMethod: 'Card (Mastercard ****1102)',
    status: 'Verified',
    notes: 'Βενζίνη οικογενειακού αυτοκινήτου',
    items: [
      { description: 'Unleaded 95 Fuel (28.9L)', price: 55.00, category: 'Fuel & Transport' }
    ]
  },
  {
    id: 'rec_3',
    merchant: 'Public Store / Βιβλία Σχολείου',
    date: '2026-11-05',
    category: 'Education & Hobbies',
    memberId: 'child1',
    memberName: 'Παιδί 1 (Αλέξανδρος)',
    total: 34.80,
    tax: 2.10,
    paymentMethod: 'Cash',
    status: 'Verified',
    notes: 'Σχολικά είδη & βοηθήματα',
    items: [
      { description: 'Σχολικό Τετράδιο 5 θέσεων', price: 6.80, category: 'Education & Hobbies' },
      { description: 'Ξενόγλωσσο Βιβλίο Αγγλικών', price: 28.00, category: 'Education & Hobbies' }
    ]
  },
  {
    id: 'rec_4',
    merchant: 'Pharmacy Central',
    date: '2026-11-06',
    category: 'Health & Pharmacy',
    memberId: 'child2',
    memberName: 'Παιδί 2 (Μαρία)',
    total: 22.40,
    tax: 1.30,
    paymentMethod: 'Card (Visa ****4821)',
    status: 'Verified',
    notes: 'Βιταμίνες & Φάρμακα',
    items: [
      { description: 'Βιταμίνη C', price: 12.00, category: 'Health & Pharmacy' },
      { description: 'Παυσίπονα', price: 10.40, category: 'Health & Pharmacy' }
    ]
  }
];

export default function App() {
  const [receipts, setReceipts] = useState(() => {
    const saved = localStorage.getItem('family_receipts_v2');
    return saved ? JSON.parse(saved) : INITIAL_RECEIPTS;
  });

  const [members, setMembers] = useState(DEFAULT_MEMBERS);
  const [selectedMember, setSelectedMember] = useState('dad');
  const [isMultiScan, setIsMultiScan] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [memberFilter, setMemberFilter] = useState('All');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareId, setShareId] = useState('home-family-2026');
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const shareInputRef = useRef(null);

  // Dynamic shareable URL
  const shareUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://family-receipts.app';
    return `${origin}/sync?family=${shareId}`;
  }, [shareId]);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('family_receipts_v2', JSON.stringify(receipts));
  }, [receipts]);

  // Robust Copy & Share handler for mobile
  const handleShareOrCopy = async () => {
    // 1. Try Native Mobile Share API (Viber, WhatsApp, Messages)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Family Receipts Sync',
          text: 'Μπες στην οικογενειακή εφαρμογή για να ανεβάζεις αποδείξεις:',
          url: shareUrl,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to clipboard
      }
    }

    // 2. Try Clipboard API
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        return;
      }
    } catch (err) {
      // Fallback if clipboard fails
    }

    // 3. Mobile Fallback: Select input text directly so user can copy manually
    if (shareInputRef.current) {
      shareInputRef.current.select();
      shareInputRef.current.setSelectionRange(0, 99999);
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (e) {
        alert('Παρακαλώ επιλέξτε και αντιγράψτε το σύνδεσμο χειροκίνητα.');
      }
    }
  };

  // Load XLSX library dynamically
  const exportToExcel = async () => {
    try {
      if (!window.XLSX) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
        document.body.appendChild(script);
        await new Promise((resolve) => (script.onload = resolve));
      }

      const XLSX = window.XLSX;
      const wb = XLSX.utils.book_new();

      // Sheet 1: Main Receipts
      const receiptRows = receipts.map((r) => ({
        'ID': r.id,
        'Ημερομηνία': r.date,
        'Κατάστημα / Έμπορος': r.merchant,
        'Κατηγορία': r.category,
        'Μέλος Οικογένειας': r.memberName || 'Γενικό',
        'Σύνολο (€)': r.total,
        'ΦΠΑ (€)': r.tax,
        'Τρόπος Πληρωμής': r.paymentMethod,
        'Σημειώσεις': r.notes || ''
      }));
      const ws1 = XLSX.utils.json_to_sheet(receiptRows);
      XLSX.utils.book_append_sheet(wb, ws1, 'Αποδείξεις');

      // Sheet 2: Category Breakdown
      const catTotals = CATEGORIES.map((cat) => {
        const catRecs = receipts.filter((r) => r.category === cat.id);
        const sum = catRecs.reduce((acc, r) => acc + r.total, 0);
        return {
          'Κατηγορία': cat.label,
          'Πλήθος Αποδείξεων': catRecs.length,
          'Συνολικό Ποσό (€)': Number(sum.toFixed(2))
        };
      });
      const ws2 = XLSX.utils.json_to_sheet(catTotals);
      XLSX.utils.book_append_sheet(wb, ws2, 'Ανά Κατηγορία');

      // Sheet 3: Member Breakdown
      const memberTotals = members.map((m) => {
        const mRecs = receipts.filter((r) => r.memberId === m.id);
        const sum = mRecs.reduce((acc, r) => acc + r.total, 0);
        return {
          'Μέλος': m.name,
          'Ρόλος': m.role,
          'Πλήθος Αποδείξεων': mRecs.length,
          'Σύνολο Εξόδων (€)': Number(sum.toFixed(2))
        };
      });
      const ws3 = XLSX.utils.json_to_sheet(memberTotals);
      XLSX.utils.book_append_sheet(wb, ws3, 'Ανά Μέλος');

      XLSX.writeFile(wb, `Family_Expenses_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      console.error('Failed to export Excel', err);
    }
  };

  // Process image files simulation
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsScanning(true);

    setTimeout(() => {
      const currentMemberObj = members.find((m) => m.id === selectedMember) || members[0];
      const newItems = [];

      if (isMultiScan) {
        newItems.push(
          {
            id: `rec_${Date.now()}_1`,
            merchant: 'Σκλαβενίτης Supermarket',
            date: new Date().toISOString().slice(0, 10),
            category: 'Supermarket',
            memberId: currentMemberObj.id,
            memberName: currentMemberObj.name,
            total: 32.40,
            tax: 4.10,
            paymentMethod: 'Card',
            status: 'Verified',
            notes: 'Multi-scan 1/2',
            items: [{ description: 'Είδη παντοπωλείου', price: 32.40, category: 'Supermarket' }]
          },
          {
            id: `rec_${Date.now()}_2`,
            merchant: 'Coffee Island',
            date: new Date().toISOString().slice(0, 10),
            category: 'Dining & Coffee',
            memberId: currentMemberObj.id,
            memberName: currentMemberObj.name,
            total: 6.50,
            tax: 0.80,
            paymentMethod: 'Cash',
            status: 'Verified',
            notes: 'Multi-scan 2/2',
            items: [{ description: 'Καφέδες & Σνακ', price: 6.50, category: 'Dining & Coffee' }]
          }
        );
      } else {
        newItems.push({
          id: `rec_${Date.now()}`,
          merchant: 'Shell Gas Station',
          date: new Date().toISOString().slice(0, 10),
          category: 'Fuel & Transport',
          memberId: currentMemberObj.id,
          memberName: currentMemberObj.name,
          total: 40.00,
          tax: 7.74,
          paymentMethod: 'Card',
          status: 'Verified',
          notes: 'Νέα σάρωση από κάμερα/αρχείο',
          items: [{ description: 'Καύσιμα', price: 40.00, category: 'Fuel & Transport' }]
        });
      }

      setReceipts((prev) => [...newItems, ...prev]);
      setIsScanning(false);
    }, 1200);
  };

  // Filtered Receipts
  const filteredReceipts = useMemo(() => {
    return receipts.filter((r) => {
      const matchesSearch =
        r.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;
      const matchesMember = memberFilter === 'All' || r.memberId === memberFilter;

      return matchesSearch && matchesCategory && matchesMember;
    });
  }, [receipts, searchTerm, categoryFilter, memberFilter]);

  // Overall Stats
  const stats = useMemo(() => {
    const grandTotal = receipts.reduce((acc, r) => acc + r.total, 0);
    const byCategory = {};
    CATEGORIES.forEach((c) => (byCategory[c.id] = 0));

    receipts.forEach((r) => {
      if (byCategory[r.category] !== undefined) {
        byCategory[r.category] += r.total;
      }
    });

    return { grandTotal, byCategory };
  }, [receipts]);

  // Per Member Stats
  const memberStats = useMemo(() => {
    return members.map((m) => {
      const mRecs = receipts.filter((r) => r.memberId === m.id);
      const total = mRecs.reduce((acc, r) => acc + r.total, 0);
      return { ...m, count: mRecs.length, total };
    });
  }, [receipts, members]);

  const deleteReceipt = (id) => {
    setReceipts((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans pb-12">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        multiple={isMultiScan}
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Family Receipt Manager
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Οικογενειακή Ταξινόμηση Εξόδων & Εξαγωγή σε Excel
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-sm font-semibold transition"
            >
              <Share2 className="w-4 h-4 text-indigo-500" />
              <span>Σύνδεση Κινητού</span>
            </button>
            <button
              onClick={exportToExcel}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-600/20 transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Excel (.xlsx)</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Upload Control Card */}
        <section className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h2 className="text-base font-bold flex items-center space-x-2">
                <Camera className="w-5 h-5 text-indigo-500" />
                <span>Προσθήκη Νέας Απόδειξης</span>
              </h2>
              <p className="text-xs text-slate-400">Επιλέξτε ποιος ανεβάζει και τον τρόπο λήψης</p>
            </div>

            {/* Select active member */}
            <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl flex-wrap gap-y-1">
              <span className="text-xs font-semibold px-2 text-slate-500">Ποιος ανεβάζει;</span>
              {members.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMember(m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedMember === m.id ? `${m.color} shadow-sm` : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={isScanning}
              className="p-5 rounded-2xl border-2 border-dashed border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-100/50 text-indigo-700 dark:text-indigo-300 flex flex-col items-center justify-center space-y-2 transition transform active:scale-98"
            >
              <div className="p-3 bg-indigo-600 text-white rounded-full shadow-md">
                <Camera className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm">📸 Φωτογραφία από Κάμερα Κινητού</span>
              <span className="text-xs text-indigo-500/80">Απευθείας λήψη με την κάμερα</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className="p-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 text-slate-700 dark:text-slate-300 flex flex-col items-center justify-center space-y-2 transition transform active:scale-98"
            >
              <div className="p-3 bg-slate-700 text-white rounded-full shadow-md">
                <Upload className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm">🖼️ Επιλογή από Συλλογή / Αρχεία</span>
              <span className="text-xs text-slate-400">Drag & drop ή επιλογή εικόνας</span>
            </button>
          </div>

          {/* Multi-scan switch */}
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isMultiScan}
                onChange={(e) => setIsMultiScan(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Multi-Scan (Πολλές αποδείξεις σε 1 φωτογραφία)</span>
            </label>
            {isScanning && (
              <span className="text-xs font-bold text-indigo-600 animate-pulse flex items-center space-x-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin inline mr-1" />
                Σάρωση & Αναγνώριση...
              </span>
            )}
          </div>
        </section>

        {/* Per Category Spending Overview Section */}
        <section className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center space-x-2">
              <PieChartIcon className="w-4 h-4 text-emerald-500" />
              <span>Κατανομή Εξόδων ανά Κατηγορία</span>
            </h3>
            <span className="text-xs text-slate-400">Πατήστε για γρήγορο φιλτράρισμα</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {CATEGORIES.map((cat) => {
              const catTotal = stats.byCategory[cat.id] || 0;
              const isSelected = categoryFilter === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(isSelected ? 'All' : cat.id)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition transform active:scale-95 ${
                    isSelected
                      ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                      : 'border-slate-100 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-900/40 hover:bg-slate-100'
                  }`}
                >
                  <span className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold border max-w-max mb-2 ${cat.color}`}>
                    {cat.id}
                  </span>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium truncate">{cat.label.split('/')[1] || cat.label}</span>
                    <h5 className="text-base font-extrabold text-slate-900 dark:text-white">€{catTotal.toFixed(2)}</h5>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Per Family Member Spending Breakdown Bar */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {memberStats.map((m) => (
            <div key={m.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${m.badge}`}>
                  {m.name}
                </span>
                <span className="text-[10px] text-slate-400">{m.count} αποδείξεις</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Σύνολο Εξόδων</span>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">€{m.total.toFixed(2)}</h4>
              </div>
            </div>
          ))}
        </section>

        {/* Filters Section */}
        <section className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Αναζήτηση κατάστημα, προϊόν ή μέλος..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Member Filter Dropdown */}
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-slate-400 hidden sm:block" />
              <select
                value={memberFilter}
                onChange={(e) => setMemberFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">Όλα τα Μέλη</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Category Dropdown */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">Όλες οι Κατηγορίες</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Table of Receipts */}
        <section className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-bold text-sm flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Λίστα Καταχωρημένων Αποδείξεων ({filteredReceipts.length})</span>
            </h3>
            <span className="text-xs text-slate-400 font-bold">
              Σύνολο Φίλτρου: €{filteredReceipts.reduce((acc, r) => acc + r.total, 0).toFixed(2)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-700">
                  <th className="py-3.5 px-4">Ημερομηνία</th>
                  <th className="py-3.5 px-4">Κατάστημα</th>
                  <th className="py-3.5 px-4">Κατηγορία</th>
                  <th className="py-3.5 px-4">Μέλος</th>
                  <th className="py-3.5 px-4">Πληρωμή</th>
                  <th className="py-3.5 px-4 text-right">Ποσό (€)</th>
                  <th className="py-3.5 px-4 text-center">Ενέργειες</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredReceipts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-400 text-xs">
                      Δεν βρέθηκαν αποδείξεις με τα επιλεγμένα φίλτρα.
                    </td>
                  </tr>
                ) : (
                  filteredReceipts.map((r) => {
                    const memberObj = members.find((m) => m.id === r.memberId);
                    const catObj = CATEGORIES.find((c) => c.id === r.category);

                    return (
                      <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition">
                        <td className="py-3.5 px-4 font-mono text-xs text-slate-500">{r.date}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-100">{r.merchant}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${catObj?.color || 'bg-slate-100'}`}>
                            {r.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${memberObj?.badge || 'bg-slate-100'}`}>
                            {r.memberName}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-500">{r.paymentMethod}</td>
                        <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-white">
                          €{r.total.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-center space-x-1">
                          <button
                            onClick={() => deleteReceipt(r.id)}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Share / Mobile Sync Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 dark:border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center space-x-2">
                <Share2 className="w-5 h-5 text-indigo-500" />
                <span>Σύνδεση Κινητού & Κοινή Πρόσβαση</span>
              </h3>
              <button onClick={() => setShowShareModal(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Στείλτε αυτόν τον σύνδεσμο στη γυναίκα ή τα παιδιά σας. Όταν βγάζουν φωτογραφία μια απόδειξη από το κινητό τους, θα καταχωρείται αυτόματα στον κοινό πίνακα!
            </p>

            {/* Editable/Selectable Input Box for Link Copy */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Σύνδεσμος Κοινής Χρήσης (Family Link)
              </label>
              <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                <input
                  ref={shareInputRef}
                  type="text"
                  readOnly
                  value={shareUrl}
                  onClick={(e) => e.target.select()}
                  className="flex-1 bg-transparent font-mono text-xs text-indigo-600 dark:text-indigo-400 outline-none px-2 py-1 select-all"
                />
                <button
                  onClick={handleShareOrCopy}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1 flex-shrink-0 ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Αντιγράφηκε!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Κοινοποίηση / Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Direct Instant Share Action Buttons for Mobile */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`viber://forward?text=${encodeURIComponent('Σύνδεσμος Αποδείξεων: ' + shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 text-center"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Αποστολή στο Viber</span>
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent('Σύνδεσμος Αποδείξεων: ' + shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 text-center"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition"
            >
              Έκλεισε
            </button>
          </div>
        </div>
      )}
    </div>
  );
}