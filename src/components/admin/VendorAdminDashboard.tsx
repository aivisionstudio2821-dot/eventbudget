import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  LogIn,
  LogOut,
  RefreshCw,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  isAuthenticatedAdmin,
  signInAdmin,
  signOutAdmin,
} from '../../services/supabaseClient';
import {
  getVendorApplications,
  VendorApplicationRow,
  updateVendorApplicationModeration,
} from '../../services/vendorRepository';

const statusFilters = ['all', 'pending', 'approved', 'rejected'] as const;
type StatusFilter = (typeof statusFilters)[number];

type PackageValue = {
  name?: string;
  price?: number;
  description?: string;
  includes?: string[];
  excludes?: string[];
};

const getPackages = (value: unknown): PackageValue[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is PackageValue => typeof item === 'object' && item !== null);
};

const formatDate = (value: string) => new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date(value));

const statusLabel = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

const statusClass = (status: string) => ({
  pending: 'border-amber-300 bg-amber-50 text-amber-800',
  approved: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  rejected: 'border-red-300 bg-red-50 text-red-800',
}[status] || 'border-slate-300 bg-slate-50 text-slate-700');

const AdminLogin: React.FC<{ onAuthenticated: () => void }> = ({ onAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await signInAdmin(email, password);
      const admin = await isAuthenticatedAdmin();
      if (!admin) {
        await signOutAdmin();
        throw new Error('This account is not authorized to access the vendor admin area.');
      }
      onAuthenticated();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4ecdf] px-4 py-12">
      <section className="w-full max-w-md rounded-[28px] border border-[#d7c39e] bg-[#fffdf8] p-7 shadow-[0_24px_70px_rgba(91,65,31,0.16)] sm:p-9">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#211b15] text-[#f4d38c]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#9a7336]">EventBudget</p>
            <h1 className="text-2xl font-black text-[#211b15]">Vendor Admin</h1>
          </div>
        </div>

        <p className="mb-6 text-sm leading-6 text-[#786f63]">Sign in with your Supabase admin account to review vendor applications.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-[#4f473d]">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-[#d7c39e] bg-white px-3.5 py-3 text-sm text-[#211b15] outline-none focus:border-[#b88a44]"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-bold text-[#4f473d]">Password</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-[#d7c39e] bg-white px-3.5 py-3 text-sm text-[#211b15] outline-none focus:border-[#b88a44]"
            />
          </label>

          {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#211b15] px-4 py-3 text-sm font-black text-[#fff7e8] transition hover:bg-[#3a2e22] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" />
            {isSubmitting ? 'Signing in...' : 'Sign in securely'}
          </button>
        </form>
      </section>
    </main>
  );
};

const ApplicationDetails: React.FC<{ application: VendorApplicationRow; onClose: () => void }> = ({ application, onClose }) => {
  const packages = getPackages(application.packages);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211b15]/60 p-4 backdrop-blur-sm">
      <section className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-[#d7c39e] bg-[#fffdf8] p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9a7336]">Application details</p>
            <h2 className="mt-1 text-2xl font-black text-[#211b15]">{application.business_name}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl border border-[#d7c39e] p-2 text-[#4f473d]" aria-label="Close application details">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ['Contact name', application.contact_name],
            ['Category', application.category],
            ['Phone', application.phone],
            ['WhatsApp', application.whatsapp],
            ['Email', application.email],
            ['City', application.city],
            ['Service area', application.service_area],
            ['Submitted', formatDate(application.submitted_at)],
            ['Updated', formatDate(application.updated_at)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-[#eadfce] bg-[#fbf6ed] p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#9a8b78]">{label}</p>
              <p className="mt-1 break-words text-sm font-semibold text-[#30261b]">{value || 'Not provided'}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-[#eadfce] bg-[#fbf6ed] p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#9a8b78]">Description</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#4f473d]">{application.description || 'Not provided'}</p>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#9a8b78]">Packages and pricing</p>
          {packages.length === 0 && <p className="text-sm text-[#786f63]">No package details provided.</p>}
          {packages.map((item, index) => (
            <div key={`${item.name || 'package'}-${index}`} className="rounded-xl border border-[#eadfce] bg-[#fbf6ed] p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-black text-[#30261b]">{item.name || 'Unnamed package'}</h3>
                {typeof item.price === 'number' && <span className="font-bold text-[#8c642d]">₹{item.price.toLocaleString('en-IN')}</span>}
              </div>
              {item.description && <p className="mt-1 text-sm text-[#4f473d]">{item.description}</p>}
              {item.includes?.length ? <p className="mt-2 text-xs text-[#4f473d]"><strong>Includes:</strong> {item.includes.join(', ')}</p> : null}
              {item.excludes?.length ? <p className="mt-1 text-xs text-[#4f473d]"><strong>Excludes:</strong> {item.excludes.join(', ')}</p> : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const AdminConsole: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [applications, setApplications] = useState<VendorApplicationRow[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [selectedApplication, setSelectedApplication] = useState<VendorApplicationRow | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');

  const loadApplications = async () => {
    setError('');
    setIsLoading(true);
    try {
      setApplications(await getVendorApplications());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Applications could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadApplications();
  }, []);

  const counts = useMemo(() => ({
    all: applications.length,
    pending: applications.filter((application) => application.status === 'pending').length,
    approved: applications.filter((application) => application.status === 'approved').length,
    rejected: applications.filter((application) => application.status === 'rejected').length,
  }), [applications]);

  const visibleApplications = applications.filter((application) => filter === 'all' || application.status === filter);

  const updateApplication = async (application: VendorApplicationRow, status: 'approved' | 'rejected') => {
    setError('');
    setUpdatingId(application.id);
    try {
      const isVisible = status === 'approved' ? true : status === 'rejected' ? false : application.is_visible;
      await updateVendorApplicationModeration(application.id, { status, is_visible: isVisible });
      await loadApplications();
      setSelectedApplication(null);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Application could not be updated.');
    } finally {
      setUpdatingId('');
    }
  };

  const toggleVisibility = async (application: VendorApplicationRow) => {
    setError('');
    setUpdatingId(application.id);
    try {
      await updateVendorApplicationModeration(application.id, {
        status: application.status,
        is_visible: !application.is_visible,
      });
      await loadApplications();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Visibility could not be updated.');
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <main className="min-h-screen bg-[#f4ecdf] text-[#211b15]">
      <header className="border-b border-[#d7c39e] bg-[#fffdf8]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#211b15] text-[#f4d38c]"><ShieldCheck className="h-5 w-5" /></div>
            <div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9a7336]">Private workspace</p><h1 className="text-xl font-black sm:text-2xl">Vendor applications</h1></div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => void loadApplications()} className="inline-flex items-center gap-2 rounded-xl border border-[#d7c39e] px-3 py-2 text-xs font-bold text-[#4f473d] hover:bg-[#fbf6ed]" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button type="button" onClick={onLogout} className="inline-flex items-center gap-2 rounded-xl bg-[#211b15] px-3 py-2 text-xs font-bold text-[#fff7e8] hover:bg-[#3a2e22]"><LogOut className="h-4 w-4" /> Log out</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="mb-6 grid gap-3 sm:grid-cols-4">
          {statusFilters.map((status) => (
            <button key={status} type="button" onClick={() => setFilter(status)} className={`rounded-2xl border p-4 text-left transition ${filter === status ? 'border-[#9a7336] bg-[#fffdf8] shadow-sm' : 'border-[#e2d3bc] bg-[#fbf6ed] hover:bg-[#fffdf8]'}`}>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#9a8b78]">{status === 'all' ? 'All applications' : `${statusLabel(status)} applications`}</p>
              <p className="mt-1 text-2xl font-black">{counts[status]}</p>
            </button>
          ))}
        </div>

        <section className="overflow-hidden rounded-3xl border border-[#d7c39e] bg-[#fffdf8] shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-[#eadfce] px-5 py-4"><div><h2 className="font-black">Applications</h2><p className="text-xs text-[#786f63]">Review, moderate, and publish vendor listings.</p></div><ChevronDown className="h-4 w-4 text-[#9a8b78]" /></div>
          {isLoading ? <p className="px-5 py-10 text-sm text-[#786f63]">Loading applications...</p> : visibleApplications.length === 0 ? <p className="px-5 py-10 text-sm text-[#786f63]">No applications in this view.</p> : (
            <div className="divide-y divide-[#eadfce]">
              {visibleApplications.map((application) => (
                <article key={application.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[1.4fr_1fr_0.8fr_auto] lg:items-center">
                  <div><div className="flex flex-wrap items-center gap-2"><h3 className="font-black">{application.business_name}</h3><span className={`rounded-full border px-2 py-1 text-[10px] font-black ${statusClass(application.status)}`}>{statusLabel(application.status)}</span></div><p className="mt-1 text-sm text-[#4f473d]">{application.contact_name} · {application.category}</p><p className="mt-1 text-xs text-[#786f63]">{application.city} · {application.service_area}</p></div>
                  <div className="text-xs leading-5 text-[#4f473d]"><p>{application.phone || 'No phone'}{application.whatsapp ? ` · WhatsApp ${application.whatsapp}` : ''}</p><p>{application.email || 'No email'}</p><p className="text-[#9a8b78]">{formatDate(application.submitted_at)}</p></div>
                  <div className="text-xs"><p className="font-bold text-[#4f473d]">Marketplace</p><p className={application.is_visible ? 'text-emerald-700' : 'text-[#9a8b78]'}>{application.is_visible ? 'Visible' : 'Hidden'}</p></div>
                  <div className="flex flex-wrap gap-2 lg:justify-end"><button type="button" onClick={() => setSelectedApplication(application)} className="rounded-xl border border-[#d7c39e] px-3 py-2 text-xs font-bold hover:bg-[#fbf6ed]">View details</button>{application.status !== 'approved' && <button type="button" disabled={updatingId === application.id} onClick={() => void updateApplication(application, 'approved')} className="inline-flex items-center gap-1 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-bold text-white disabled:opacity-60"><Check className="h-3.5 w-3.5" /> Approve</button>}{application.status !== 'rejected' && <button type="button" disabled={updatingId === application.id} onClick={() => void updateApplication(application, 'rejected')} className="inline-flex items-center gap-1 rounded-xl bg-red-700 px-3 py-2 text-xs font-bold text-white disabled:opacity-60"><X className="h-3.5 w-3.5" /> Reject</button>}<button type="button" disabled={updatingId === application.id} onClick={() => void toggleVisibility(application)} className="inline-flex items-center gap-1 rounded-xl border border-[#d7c39e] px-3 py-2 text-xs font-bold hover:bg-[#fbf6ed] disabled:opacity-60">{application.is_visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}{application.is_visible ? 'Hide' : 'Show'}</button></div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedApplication && <ApplicationDetails application={selectedApplication} onClose={() => setSelectedApplication(null)} />}
    </main>
  );
};

export const VendorAdminDashboard: React.FC = () => {
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    isAuthenticatedAdmin()
      .then(setIsAdmin)
      .catch(() => setIsAdmin(false))
      .finally(() => setIsCheckingAccess(false));
  }, []);

  if (isCheckingAccess) {
    return <main className="flex min-h-screen items-center justify-center bg-[#f4ecdf] text-sm font-bold text-[#786f63]">Checking admin access...</main>;
  }

  if (!isAdmin) return <AdminLogin onAuthenticated={() => setIsAdmin(true)} />;

  return <AdminConsole onLogout={async () => { await signOutAdmin(); setIsAdmin(false); }} />;
};
