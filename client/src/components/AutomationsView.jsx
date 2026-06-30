import { useState } from 'react';

export default function AutomationsView() {
  const [rules, setRules] = useState([
    {
      id: 1,
      badge: "High Confidence",
      time: "Updated 2h ago",
      description: 'When Confidence is above 90% for Financial Records, then Auto-confirm redaction.',
      highlights: { trigger: 'Confidence', value: '90%', scope: 'Financial Records', action: 'Auto-confirm' },
      active: true,
      badgeStyle: "bg-primary-fixed-dim/20 text-on-primary-fixed-variant"
    },
    {
      id: 2,
      badge: "Bulk Review",
      time: "Updated 1d ago",
      description: 'When Document Type is W-2 Form, apply Full Masking to all Social Security Numbers.',
      highlights: { trigger: 'Document Type', value: 'W-2 Form', scope: 'Social Security Numbers', action: 'Full Masking' },
      active: true,
      badgeStyle: "bg-tertiary/10 text-tertiary"
    },
    {
      id: 3,
      badge: "Experimental",
      time: "Last used 3 weeks ago",
      description: 'When Entity Type is Handwritten Date, then Flag for Manual Review with Low Priority.',
      highlights: { trigger: 'Entity Type', value: 'Handwritten Date', scope: '', action: 'Flag for Manual Review' },
      active: false,
      badgeStyle: "bg-surface-variant text-on-surface-variant"
    },
    {
      id: 4,
      badge: "PII Protection",
      time: "Updated 4h ago",
      description: 'When Email Address contains "@gmail.com", apply Synthetic pseudonym and Encrypted Export.',
      highlights: { trigger: 'Email Address', value: '"@gmail.com"', scope: 'Encrypted Export', action: 'Synthetic pseudonym' },
      active: true,
      badgeStyle: "bg-secondary/10 text-secondary"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ condition: 'Confidence', value: '90%', action: 'Auto-confirm' });

  const toggleRule = (id) => {
    setRules(prev => prev.map(rule =>
      rule.id === id ? { ...rule, active: !rule.active } : rule
    ));
  };

  const deleteRule = (id) => {
    if (window.confirm("Are you sure you want to delete this automation rule?")) {
      setRules(prev => prev.filter(rule => rule.id !== id));
    }
  };

  const handleEdit = (rule) => {
    setEditingId(rule.id);
    setFormData({
      condition: rule.highlights?.trigger || 'Confidence',
      value: rule.highlights?.value || '',
      action: rule.highlights?.action || 'Auto-confirm'
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingId) {
      setRules(prev => prev.map(rule => rule.id === editingId ? {
        ...rule,
        description: `When ${formData.condition} is ${formData.value}, then ${formData.action}.`,
        highlights: { trigger: formData.condition, value: formData.value, scope: 'Global', action: formData.action },
        time: "Just updated"
      } : rule));
    } else {
      setRules(prev => [
        {
          id: Date.now(),
          badge: "Custom Rule",
          time: "Just created",
          description: `When ${formData.condition} is ${formData.value}, then ${formData.action}.`,
          highlights: { trigger: formData.condition, value: formData.value, scope: 'Global', action: formData.action },
          active: true,
          badgeStyle: "bg-surface-variant text-on-surface-variant"
        },
        ...prev
      ]);
    }
    setShowForm(false);
    setEditingId(null);
    setFormData({ condition: 'Confidence', value: '90%', action: 'Auto-confirm' });
  };

  return (
    <div className="flex-1 overflow-y-auto p-12 bg-surface">
      <div className="max-w-5xl mx-auto mt-8 flex flex-col gap-12">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-headline-lg text-[32px] font-bold text-on-surface mb-2">Automation Workflow</h1>
            <p className="text-on-surface-variant font-body-doc italic text-lg">
              Define rules for intelligent document processing and auto-redaction.
            </p>
          </div>
          {!showForm && (
            <button 
              className="bg-primary text-on-primary font-bold px-6 py-3 rounded-md hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-2 shadow-sm"
              onClick={() => {
                setEditingId(null);
                setFormData({ condition: 'Confidence', value: '90%', action: 'Auto-confirm' });
                setShowForm(true);
              }}
            >
              <span className="material-symbols-outlined">add</span>
              New Rule
            </button>
          )}
        </div>

        {/* Rule Form */}
        {showForm && (
          <div className="paper-card rounded-xl p-8 bg-surface-container-low border border-outline-variant/50 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-xl font-bold text-on-surface">{editingId ? 'Edit Rule' : 'Create New Automation'}</h3>
              <button 
                className="text-on-surface-variant hover:text-error transition-colors"
                onClick={() => { setShowForm(false); setEditingId(null); }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="font-bold text-on-surface">When</span>
                <select 
                  className="bg-surface-container border border-outline-variant/50 rounded-md px-4 py-2 font-body-ui text-sm text-on-surface focus:outline-none"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                >
                  <option>Confidence</option>
                  <option>Document Type</option>
                  <option>Entity Type</option>
                </select>
                <span className="font-bold text-on-surface">is</span>
                <input 
                  type="text" 
                  placeholder="e.g. 90% or W-2 Form"
                  className="bg-surface-container border border-outline-variant/50 rounded-md px-4 py-2 font-body-ui text-sm text-on-surface focus:outline-none flex-1 min-w-[200px]"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                />
                <span className="font-bold text-on-surface">then</span>
                <select 
                  className="bg-surface-container border border-outline-variant/50 rounded-md px-4 py-2 font-body-ui text-sm text-on-surface focus:outline-none"
                  value={formData.action}
                  onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                >
                  <option>Auto-confirm</option>
                  <option>Full Masking</option>
                  <option>Flag for Manual Review</option>
                  <option>Synthetic pseudonym</option>
                </select>
              </div>
              <div className="flex justify-end mt-4">
                <button 
                  className="bg-primary text-on-primary font-bold px-6 py-2 rounded-md hover:bg-primary-container transition-all"
                  onClick={handleSave}
                >
                  {editingId ? 'Save Changes' : 'Create Rule'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rule List */}
        <div className="flex flex-col gap-6">
          {rules.length === 0 && (
            <div className="paper-card rounded-xl p-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-4 block">rule</span>
              <p className="font-headline-md text-xl">No automation rules configured</p>
              <p className="mt-2">Click "New Rule" to create your first automation.</p>
            </div>
          )}
          {rules.map((rule) => (
            <div key={rule.id} className={`paper-card rounded-xl p-8 flex items-center justify-between gap-8 transition-all ${!rule.active ? 'opacity-60 grayscale-[0.5] bg-surface-container-low' : ''}`}>
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm ${rule.badgeStyle}`}>
                    {rule.badge}
                  </span>
                  <span className="text-sm text-on-surface-variant italic">{rule.time}</span>
                </div>
                <p className="font-body-doc text-lg leading-relaxed text-on-surface">
                  {rule.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-8 shrink-0">
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-all ${rule.active ? 'bg-primary justify-end' : 'bg-surface-variant justify-start border border-outline-variant/50'}`}
                    aria-label={`Toggle rule: ${rule.badge}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm transition-all"></div>
                  </button>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{rule.active ? 'Active' : 'Paused'}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    className="text-secondary hover:text-primary transition-colors"
                    onClick={() => handleEdit(rule)}
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button 
                    className="text-secondary hover:text-error transition-colors"
                    onClick={() => deleteRule(rule.id)}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Metrics */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-8 flex flex-col gap-2">
            <h4 className="text-sm text-on-surface-variant font-medium">Automated Savings</h4>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-lg text-4xl text-primary font-bold">124h</span>
              <span className="text-sm text-on-surface-variant">this month</span>
            </div>
          </div>
          
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-8 flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 text-surface-variant/50 opacity-20 pointer-events-none">
              <span className="material-symbols-outlined text-[120px]">smart_toy</span>
            </div>
            <h4 className="text-sm text-on-surface-variant font-medium relative z-10">AI Accuracy</h4>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="font-headline-lg text-4xl text-on-surface font-bold">99.2%</span>
              <span className="text-sm text-on-surface-variant">avg. confidence</span>
            </div>
          </div>

          <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-8 flex flex-col gap-2">
            <h4 className="text-sm text-on-surface-variant font-medium">System Health</h4>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-lg text-4xl text-primary font-bold">Optimal</span>
              <span className="text-sm text-on-surface-variant">all nodes active</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
