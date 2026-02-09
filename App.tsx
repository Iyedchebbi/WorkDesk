
import React, { useState, useEffect, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } = ReactRouterDOM as any;
const Router = HashRouter;
import { auth, db } from './firebase';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Clients } from './pages/Clients';
import { Tasks } from './pages/Tasks';
import { Invoices } from './pages/Invoices';
import { Settings } from './pages/Settings';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Modal } from './components/Modal';
import { Project, Client, Task, Invoice, UserProfile, PlanType } from './types';
import { MOCK_USER, STRIPE_LINKS } from './constants';
import { Zap, ArrowRight, AlertCircle } from 'lucide-react';

const SuccessHandler: React.FC<{ onProvision: (plan: PlanType) => void }> = ({ onProvision }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const plan = params.get('plan') as PlanType;
    if (plan && (plan === 'pro' || plan === 'agency')) {
      onProvision(plan);
      navigate('/', { replace: true });
    }
  }, [location, onProvision, navigate]);
  
  return null;
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [user, setUser] = useState<UserProfile>(MOCK_USER);

  const [modalType, setModalType] = useState<'project' | 'client' | 'task' | 'invoice' | 'insufficient_credits' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const unsubsRef = useRef<(() => void)[]>([]);

  const cleanupListeners = () => {
    unsubsRef.current.forEach((unsub) => unsub());
    unsubsRef.current = [];
  };

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (firebaseUser) => {
      cleanupListeners();

      if (firebaseUser) {
        setIsAuthenticated(true);
        
        try {
          const profileRef = db.collection('profiles').doc(firebaseUser.uid);
          const profileSnap = await profileRef.get();
          
          if (!profileSnap.exists) {
            const newUser: UserProfile = {
              name: firebaseUser.displayName || 'New User',
              email: firebaseUser.email || '',
              avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'User')}&background=22D3EE&color=020617`,
              role: 'Freelancer',
              planType: 'free',
              credits: 3
            };
            await profileRef.set({
              ...newUser,
              createdAt: new Date().toISOString()
            });
            setUser(newUser);
          } else {
            const data = profileSnap.data() as UserProfile;
            if (data.credits === undefined) data.credits = 3;
            if (data.planType === undefined) data.planType = 'free';
            setUser(data);
          }

          unsubsRef.current.push(
            profileRef.onSnapshot((doc) => {
              if (doc.exists) setUser(doc.data() as UserProfile);
            })
          );

          unsubsRef.current.push(
            db.collection('projects').where('userId', '==', firebaseUser.uid)
              .onSnapshot((s) => setProjects(s.docs.map(d => ({ id: d.id, ...d.data() } as Project))))
          );

          unsubsRef.current.push(
            db.collection('clients').where('userId', '==', firebaseUser.uid)
              .onSnapshot((s) => setClients(s.docs.map(d => ({ id: d.id, ...d.data() } as Client))))
          );

          unsubsRef.current.push(
            db.collection('tasks').where('userId', '==', firebaseUser.uid)
              .onSnapshot((s) => setTasks(s.docs.map(d => ({ id: d.id, ...d.data() } as Task))))
          );

          unsubsRef.current.push(
            db.collection('invoices').where('userId', '==', firebaseUser.uid)
              .onSnapshot((s) => setInvoices(s.docs.map(d => ({ id: d.id, ...d.data() } as Invoice))))
          );

        } catch (error) {
          console.error("Firestore sync error:", error);
        }
      } else {
        setIsAuthenticated(false);
        setProjects([]);
        setClients([]);
        setTasks([]);
        setInvoices([]);
        setUser(MOCK_USER);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      cleanupListeners();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const handleProvision = async (plan: PlanType) => {
    if (!auth.currentUser) return;
    const creditMap = { free: 3, pro: 10, agency: 50 };
    await db.collection('profiles').doc(auth.currentUser.uid).update({
      planType: plan,
      credits: creditMap[plan],
      subscriptionStatus: 'active'
    });
  };

  const checkAndDeductCredits = async () => {
    if (!auth.currentUser) return false;
    if (user.credits <= 0) {
      setModalType('insufficient_credits');
      return false;
    }
    const newCredits = user.credits - 1;
    await db.collection('profiles').doc(auth.currentUser.uid).update({
      credits: newCredits
    });
    return true;
  };

  const closeModal = () => {
    setModalType(null);
    setEditingItem(null);
  };

  // CRUD Functions
  const saveProject = async (name: string, clientId: string, budget: number, deadline: string) => {
    if (editingItem) {
      await db.collection('projects').doc(editingItem.id).update({ name, clientId, budget, deadline });
    } else {
      if (!(await checkAndDeductCredits())) return;
      await db.collection('projects').add({
        name, clientId, budget, deadline, status: 'Active', userId: auth.currentUser!.uid, createdAt: new Date().toISOString()
      });
    }
    closeModal();
  };

  const deleteProject = async (id: string) => {
    if(window.confirm("Delete this project and its related tasks?")) {
      await db.collection('projects').doc(id).delete();
      const relatedTasks = tasks.filter(t => t.projectId === id);
      for (const t of relatedTasks) {
        await db.collection('tasks').doc(t.id).delete();
      }
    }
  };

  const saveClient = async (name: string, email: string, company: string) => {
    if (editingItem) {
      await db.collection('clients').doc(editingItem.id).update({ name, email, company });
    } else {
      await db.collection('clients').add({
        name, email, company, userId: auth.currentUser!.uid, createdAt: new Date().toISOString()
      });
    }
    closeModal();
  };

  const deleteClient = async (id: string) => {
    if(window.confirm("Delete client?")) {
      await db.collection('clients').doc(id).delete();
    }
  };

  const saveTask = async (title: string, projectId: string, dueDate: string) => {
    if (editingItem) {
      await db.collection('tasks').doc(editingItem.id).update({ title, projectId, dueDate });
    } else {
      await db.collection('tasks').add({
        title, status: 'To Do', dueDate: dueDate || new Date().toISOString().split('T')[0], projectId, userId: auth.currentUser!.uid, createdAt: new Date().toISOString()
      });
    }
    closeModal();
  };

  const toggleTaskStatus = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) await db.collection('tasks').doc(id).update({ status: task.status === 'To Do' ? 'Done' : 'To Do' });
  };

  const deleteTask = async (id: string) => await db.collection('tasks').doc(id).delete();

  const saveInvoice = async (title: string, amount: number) => {
    if (editingItem) {
      await db.collection('invoices').doc(editingItem.id).update({ title, amount });
    } else {
      await db.collection('invoices').add({
        title, amount, status: 'Unpaid', date: new Date().toISOString().split('T')[0], clientId: 'none', userId: auth.currentUser!.uid, createdAt: new Date().toISOString()
      });
    }
    closeModal();
  };

  const deleteInvoice = async (id: string) => {
    if(window.confirm("Delete this invoice?")) {
      await db.collection('invoices').doc(id).delete();
    }
  };

  const onUpdateUser = async (updatedUser: UserProfile) => {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      await db.collection('profiles').doc(firebaseUser.uid).update({
        name: updatedUser.name,
        role: updatedUser.role,
        avatar: updatedUser.avatar
      });
    }
  };

  const openEditModal = (type: any, item: any) => {
    setEditingItem(item);
    setModalType(type);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full bg-[#020617] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#22D3EE]/20 border-t-[#22D3EE] rounded-full animate-spin"></div>
          <p className="text-[#94A3B8] text-xs font-black uppercase tracking-[0.4em] animate-pulse">Syncing Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <SuccessHandler onProvision={handleProvision} />
      <Routes>
        <Route path="/home" element={isAuthenticated ? <Navigate to="/" /> : <Home />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />
        <Route path="/*" element={
          isAuthenticated ? (
            <div className="flex h-screen w-full bg-[#020617] overflow-hidden">
              <Sidebar onLogout={handleLogout} user={user} />
              <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                <Routes>
                  <Route path="/" element={<Dashboard projects={projects} tasks={tasks} clients={clients} invoices={invoices} user={user} onQuickAction={(type) => setModalType(type)} />} />
                  <Route path="/projects" element={<Projects projects={projects} tasks={tasks} onAdd={() => setModalType('project')} onEdit={(p) => openEditModal('project', p)} onDelete={deleteProject} />} />
                  <Route path="/clients" element={<Clients clients={clients} onAdd={() => setModalType('client')} onEdit={(c) => openEditModal('client', c)} onDelete={deleteClient} />} />
                  <Route path="/tasks" element={<Tasks tasks={tasks} projects={projects} onAdd={() => setModalType('task')} onEdit={(t) => openEditModal('task', t)} onToggleStatus={toggleTaskStatus} onDelete={deleteTask} />} />
                  <Route path="/invoices" element={<Invoices invoices={invoices} onAdd={() => setModalType('invoice')} onEdit={(inv) => openEditModal('invoice', inv)} onDelete={deleteInvoice} />} />
                  <Route path="/settings" element={<Settings user={user} onUpdateUser={onUpdateUser} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>

                <Modal 
                  isOpen={!!modalType} 
                  onClose={closeModal} 
                  title={modalType === 'insufficient_credits' ? 'Credits Exhausted' : (editingItem ? `Edit ${modalType?.charAt(0).toUpperCase()}${modalType?.slice(1)}` : `Add New ${modalType?.charAt(0).toUpperCase()}${modalType?.slice(1)}`)}
                >
                  {modalType === 'insufficient_credits' ? (
                    <div className="space-y-6 text-center">
                      <div className="mx-auto w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-400">
                        <AlertCircle size={32} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white">Unlock more projects</h3>
                        <p className="text-sm text-[#94A3B8]">You've used all your initial credits. Upgrade your plan to continue scaling your business.</p>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                         <a href={`${STRIPE_LINKS.pro}?prefilled_email=${encodeURIComponent(user.email)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-[#22D3EE] text-[#020617] rounded-xl font-black group hover:bg-cyan-300 transition-all">
                            <span>Get 10 Credits (Pro)</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                         </a>
                         <button onClick={closeModal} className="py-3 text-xs font-bold text-[#475569] uppercase tracking-widest hover:text-white transition-colors">
                            Dismiss
                         </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const target = e.target as any;
                      if (modalType === 'project') saveProject(target.name.value, target.clientId.value, parseFloat(target.budget.value), target.deadline.value);
                      if (modalType === 'client') saveClient(target.name.value, target.email.value, target.company.value);
                      if (modalType === 'task') saveTask(target.title.value, target.projectId.value, target.dueDate.value);
                      if (modalType === 'invoice') saveInvoice(target.title.value, parseFloat(target.amount.value));
                    }} className="space-y-6">
                      {modalType === 'project' && (
                        <div className="space-y-4">
                          <input name="name" required defaultValue={editingItem?.name || ''} placeholder="Project Name" className="w-full bg-[#020617] border border-[#1E2938] rounded-xl p-3 text-white outline-none focus:border-[#22D3EE]" />
                          <select name="clientId" defaultValue={editingItem?.clientId || 'none'} className="w-full bg-[#020617] border border-[#1E2938] rounded-xl p-3 text-white outline-none">
                            <option value="none">General Client</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                          <input name="budget" type="number" required defaultValue={editingItem?.budget || ''} placeholder="Budget ($)" className="w-full bg-[#020617] border border-[#1E2938] rounded-xl p-3 text-white outline-none" />
                          <input name="deadline" type="date" required defaultValue={editingItem?.deadline || ''} className="w-full bg-[#020617] border border-[#1E2938] rounded-xl p-3 text-white [color-scheme:dark]" />
                          <button type="submit" className="w-full py-4 bg-[#22D3EE] text-[#020617] font-bold rounded-xl shadow-lg shadow-[#22D3EE20]">
                            {editingItem ? 'Save Changes' : 'Create (1 Credit)'}
                          </button>
                        </div>
                      )}
                      {modalType === 'client' && (
                        <div className="space-y-4">
                          <input name="name" required defaultValue={editingItem?.name || ''} placeholder="Full Name" className="w-full bg-[#020617] border border-[#1E2938] rounded-xl p-3 text-white outline-none" />
                          <input name="email" type="email" required defaultValue={editingItem?.email || ''} placeholder="Email" className="w-full bg-[#020617] border border-[#1E2938] rounded-xl p-3 text-white outline-none" />
                          <input name="company" defaultValue={editingItem?.company || ''} placeholder="Company" className="w-full bg-[#020617] border border-[#1E2938] rounded-xl p-3 text-white outline-none" />
                          <button type="submit" className="w-full py-4 bg-[#22D3EE] text-[#020617] font-bold rounded-xl">
                            {editingItem ? 'Update Client' : 'Add Client'}
                          </button>
                        </div>
                      )}
                      {modalType === 'task' && (
                        <div className="space-y-4">
                          <input name="title" required defaultValue={editingItem?.title || ''} placeholder="Task Title" className="w-full bg-[#020617] border border-[#1E2938] rounded-xl p-3 text-white outline-none" />
                          <select name="projectId" defaultValue={editingItem?.projectId || 'none'} className="w-full bg-[#020617] border border-[#1E2938] rounded-xl p-3 text-white outline-none">
                            <option value="none">No Project</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                          <input name="dueDate" type="date" required defaultValue={editingItem?.dueDate || new Date().toISOString().split('T')[0]} className="w-full bg-[#020617] border border-[#1E2938] rounded-xl p-3 text-white [color-scheme:dark]" />
                          <button type="submit" className="w-full py-4 bg-[#22D3EE] text-[#020617] font-bold rounded-xl">
                            {editingItem ? 'Update Task' : 'Create Task'}
                          </button>
                        </div>
                      )}
                      {modalType === 'invoice' && (
                        <div className="space-y-4">
                          <input name="title" required defaultValue={editingItem?.title || ''} placeholder="Invoice Title" className="w-full bg-[#020617] border border-[#1E2938] rounded-xl p-3 text-white outline-none" />
                          <input name="amount" type="number" required defaultValue={editingItem?.amount || ''} placeholder="Amount ($)" className="w-full bg-[#020617] border border-[#1E2938] rounded-xl p-3 text-white outline-none" />
                          <button type="submit" className="w-full py-4 bg-[#22D3EE] text-[#020617] font-bold rounded-xl">
                            {editingItem ? 'Update Invoice' : 'Generate Invoice'}
                          </button>
                        </div>
                      )}
                    </form>
                  )}
                </Modal>
              </main>
            </div>
          ) : (
            <Navigate to="/home" />
          )
        } />
      </Routes>
    </Router>
  );
};

export default App;
