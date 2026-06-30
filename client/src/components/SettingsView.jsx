import { useState } from 'react';

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="flex-1 overflow-y-auto p-12 bg-surface">
      <div className="max-w-5xl mx-auto flex gap-16 mt-8">
        {/* Left Sidebar for Settings Navigation */}
        <aside className="w-64 flex flex-col gap-2 shrink-0">
          <h1 className="font-headline-lg text-[32px] font-bold text-on-surface mb-8">Settings</h1>
          
          <button 
            onClick={() => setActiveTab('profile')}
            className={`font-bold rounded-lg px-4 py-4 flex items-center gap-4 cursor-pointer transition-all w-full text-left ${activeTab === 'profile' ? 'bg-primary-fixed-dim/20 text-on-primary-fixed border-l-4 border-primary' : 'text-secondary font-medium hover:text-primary hover:bg-secondary-container/50 border-l-4 border-transparent'}`}
          >
            <span className="material-symbols-outlined">person</span>
            <span>Profile</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('workspace')}
            className={`font-bold rounded-lg px-4 py-4 flex items-center gap-4 cursor-pointer transition-all w-full text-left ${activeTab === 'workspace' ? 'bg-primary-fixed-dim/20 text-on-primary-fixed border-l-4 border-primary' : 'text-secondary font-medium hover:text-primary hover:bg-secondary-container/50 border-l-4 border-transparent'}`}
          >
            <span className="material-symbols-outlined">work</span>
            <span>Workspace</span>
          </button>

          <button 
            onClick={() => setActiveTab('detection')}
            className={`font-bold rounded-lg px-4 py-4 flex items-center gap-4 cursor-pointer transition-all w-full text-left ${activeTab === 'detection' ? 'bg-primary-fixed-dim/20 text-on-primary-fixed border-l-4 border-primary' : 'text-secondary font-medium hover:text-primary hover:bg-secondary-container/50 border-l-4 border-transparent'}`}
          >
            <span className="material-symbols-outlined">shield</span>
            <span>Detection</span>
          </button>

          <button 
            onClick={() => setActiveTab('notifications')}
            className={`font-bold rounded-lg px-4 py-4 flex items-center gap-4 cursor-pointer transition-all w-full text-left ${activeTab === 'notifications' ? 'bg-primary-fixed-dim/20 text-on-primary-fixed border-l-4 border-primary' : 'text-secondary font-medium hover:text-primary hover:bg-secondary-container/50 border-l-4 border-transparent'}`}
          >
            <span className="material-symbols-outlined">notifications</span>
            <span>Notifications</span>
          </button>

          <div className="mt-12 bg-surface-container-low p-6 rounded-lg border border-outline-variant/30">
            <p className="text-on-surface-variant italic font-body-doc text-sm mb-4">
              "In the digital age, privacy is not a luxury, it is a prerequisite for justice."
            </p>
            <p className="text-primary font-bold text-sm flex items-center gap-2">
              <span className="w-4 h-[2px] bg-primary"></span> Conseal Ethos
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-8">
          {activeTab === 'profile' && (
            <>
              {/* Personal Information Card */}
              <div className="paper-card rounded-xl p-8 pb-6 flex flex-col gap-6 animate-[fadeIn_0.3s_ease-out]">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="font-headline-md text-2xl font-bold text-on-surface">Personal Information</h2>
                    <p className="text-on-surface-variant mt-1">Manage how your identity is presented within legal workflows.</p>
                  </div>
                  <div className="w-16 h-16 rounded-xl bg-inverse-surface border-2 border-outline-variant shadow-md flex items-center justify-center text-on-inverse-surface overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=150&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-label-caps font-bold text-on-surface-variant uppercase text-xs tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue="Arlo Vance" 
                      className="bg-surface-container border border-outline-variant/50 rounded-md px-4 py-3 font-body-ui text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all shadow-inner"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-label-caps font-bold text-on-surface-variant uppercase text-xs tracking-widest">Display Name</label>
                    <input 
                      type="text" 
                      defaultValue="A. Vance" 
                      className="bg-surface-container border border-outline-variant/50 rounded-md px-4 py-3 font-body-ui text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-label-caps font-bold text-on-surface-variant uppercase text-xs tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue="a.vance@chancery-partners.com" 
                    className="bg-surface-container border border-outline-variant/50 rounded-md px-4 py-3 font-body-ui text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all shadow-inner"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-label-caps font-bold text-on-surface-variant uppercase text-xs tracking-widest">Professional Bio</label>
                  <textarea 
                    defaultValue="Senior Compliance Analyst specializing in multi-jurisdictional data privacy and secure discovery workflows." 
                    rows="3"
                    className="bg-surface-container border border-outline-variant/50 rounded-md px-4 py-3 font-body-doc leading-relaxed text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all shadow-inner resize-none"
                  />
                </div>

                <div className="flex justify-end mt-4">
                  <button className="bg-primary text-on-primary font-bold px-8 py-3 rounded-md hover:bg-primary-container hover:text-on-primary-container transition-all">
                    Save Changes
                  </button>
                </div>
              </div>

              {/* Danger Zone Card */}
              <div className="bg-error-container/20 border border-error/30 rounded-xl p-8 flex flex-col gap-6 mt-4 relative overflow-hidden shadow-sm animate-[fadeIn_0.3s_ease-out]">
                <div className="absolute top-0 left-0 w-2 h-full bg-error/70"></div>
                <div>
                  <h2 className="font-headline-md text-2xl font-bold text-tertiary">Danger Zone</h2>
                  <p className="text-on-surface-variant mt-1 text-sm">Critical actions that may result in permanent data loss. Exercise extreme caution.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button className="border border-tertiary text-tertiary font-bold px-6 py-4 rounded-md hover:bg-tertiary/10 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">sync</span>
                    Purge Workspace Cache
                  </button>
                  <button className="bg-tertiary text-on-tertiary font-bold px-6 py-4 rounded-md hover:bg-tertiary-container hover:text-on-tertiary-container transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">block</span>
                    Deactivate Account
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab !== 'profile' && (
            <div className="paper-card rounded-xl p-12 text-center text-on-surface-variant flex flex-col items-center justify-center min-h-[400px] animate-[fadeIn_0.3s_ease-out]">
              <span className="material-symbols-outlined text-6xl mb-4 text-outline-variant">construction</span>
              <h2 className="font-headline-md text-2xl font-bold text-on-surface mb-2">Under Construction</h2>
              <p className="text-on-surface-variant max-w-md mx-auto">
                The <span className="capitalize font-bold">{activeTab}</span> settings panel is currently being updated for the v4.3 release. Please check back later.
              </p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
