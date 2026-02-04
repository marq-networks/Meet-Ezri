import { AppLayout } from "../../components/AppLayout";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Plus,
  Phone,
  Mail,
  User,
  Edit,
  Trash2,
  ArrowLeft,
  AlertCircle,
  Bell,
  BellOff,
  Shield,
  Check,
  X,
  MessageSquare
} from "lucide-react";
import { useState, useEffect } from "react";

interface EmergencyContact {
  id: number;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isTrustedContact: boolean; // NEW: Can receive safety notifications
  notificationPreference: 'sms' | 'email' | 'both'; // NEW: How to notify
  lastNotified?: string; // NEW: Track when last notified
}

export function EmergencyContacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      relationship: "Mother",
      phone: "(555) 123-4567",
      email: "sarah.j@email.com",
      isTrustedContact: true,
      notificationPreference: 'both'
    },
    {
      id: 2,
      name: "Mike Chen",
      relationship: "Best Friend",
      phone: "(555) 987-6543",
      email: "mike.chen@email.com",
      isTrustedContact: true,
      notificationPreference: 'sms'
    },
    {
      id: 3,
      name: "Dr. Emily Roberts",
      relationship: "Therapist",
      phone: "(555) 246-8135",
      email: "dr.roberts@therapy.com",
      isTrustedContact: false,
      notificationPreference: 'email'
    }
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: "",
    isTrustedContact: false,
    notificationPreference: 'both' as 'sms' | 'email' | 'both'
  });

  // Load contacts from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('ezri_emergency_contacts');
    if (stored) {
      try {
        setContacts(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading contacts:', e);
      }
    }
  }, []);

  // Save contacts to localStorage
  useEffect(() => {
    localStorage.setItem('ezri_emergency_contacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleAddContact = () => {
    if (formData.name && formData.phone) {
      const newContact: EmergencyContact = {
        id: Date.now(),
        ...formData
      };
      setContacts([...contacts, newContact]);
      setFormData({ 
        name: "", 
        relationship: "", 
        phone: "", 
        email: "",
        isTrustedContact: false,
        notificationPreference: 'both'
      });
      setShowAddModal(false);
    }
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      email: contact.email,
      isTrustedContact: contact.isTrustedContact,
      notificationPreference: contact.notificationPreference
    });
    setShowAddModal(true);
  };

  const handleUpdateContact = () => {
    if (editingContact) {
      setContacts(contacts.map(c => 
        c.id === editingContact.id 
          ? { ...c, ...formData }
          : c
      ));
      setFormData({ 
        name: "", 
        relationship: "", 
        phone: "", 
        email: "",
        isTrustedContact: false,
        notificationPreference: 'both'
      });
      setEditingContact(null);
      setShowAddModal(false);
    }
  };

  const handleDeleteContact = (id: number) => {
    if (confirm("Are you sure you want to delete this emergency contact?")) {
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  const toggleTrustedContact = (id: number) => {
    setContacts(contacts.map(c =>
      c.id === id ? { ...c, isTrustedContact: !c.isTrustedContact } : c
    ));
  };

  const trustedContactsCount = contacts.filter(c => c.isTrustedContact).length;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold">Emergency Contacts</h1>
              </div>
              <p className="text-muted-foreground">
                Manage your trusted contacts for crisis situations
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingContact(null);
                setFormData({ name: "", relationship: "", phone: "", email: "", isTrustedContact: false, notificationPreference: 'both' });
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Contact</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 space-y-4"
        >
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">About Emergency Contacts</h3>
                <p className="text-sm text-blue-800">
                  These contacts may be notified if you're in crisis or need immediate support. Make sure to inform them that they're listed as emergency contacts.
                </p>
              </div>
            </div>
          </Card>

          {/* Trusted Contact Info */}
          <Card className="p-4 bg-purple-50 border-purple-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-purple-900 mb-1">
                  Trusted Contacts ({trustedContactsCount})
                </h3>
                <p className="text-sm text-purple-800 mb-2">
                  Trusted contacts can receive automatic check-in notifications when our safety system detects you may need support.
                </p>
                <div className="flex items-center gap-2 text-xs text-purple-700 bg-purple-100 rounded-lg px-3 py-2">
                  <Bell className="w-4 h-4" />
                  <span>Privacy-safe messages • No medical details shared • You stay in control</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Contacts List */}
        <div className="space-y-4">
          {contacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <Card className={`p-6 shadow-lg hover:shadow-xl transition-all group ${
                contact.isTrustedContact ? 'border-2 border-purple-200 bg-purple-50/30' : ''
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {contact.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-lg">{contact.name}</h3>
                          {contact.isTrustedContact && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 border border-purple-300 rounded-full">
                              <Shield className="w-3 h-3 text-purple-700" />
                              <span className="text-xs font-medium text-purple-700">Trusted</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                      </div>
                    </div>
                    <div className="space-y-2 ml-15">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <a href={`tel:${contact.phone}`} className="hover:text-primary transition-colors">
                          {contact.phone}
                        </a>
                      </div>
                      {contact.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">
                            {contact.email}
                          </a>
                        </div>
                      )}
                      {contact.isTrustedContact && (
                        <div className="flex items-center gap-2 text-sm">
                          <Bell className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            Notifications: {
                              contact.notificationPreference === 'both' ? 'SMS & Email' :
                              contact.notificationPreference === 'sms' ? 'SMS Only' :
                              'Email Only'
                            }
                          </span>
                        </div>
                      )}
                      {contact.lastNotified && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <MessageSquare className="w-3 h-3" />
                          <span>Last notified: {new Date(contact.lastNotified).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {/* Trusted Contact Toggle */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleTrustedContact(contact.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        contact.isTrustedContact 
                          ? 'bg-purple-100 hover:bg-purple-200' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      title={contact.isTrustedContact ? 'Remove from trusted contacts' : 'Add to trusted contacts'}
                    >
                      {contact.isTrustedContact ? (
                        <Bell className="w-4 h-4 text-purple-600" />
                      ) : (
                        <BellOff className="w-4 h-4 text-gray-600" />
                      )}
                    </motion.button>
                    
                    {/* Edit/Delete Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditContact(contact)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteContact(contact.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {contacts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">No Emergency Contacts Yet</h3>
            <p className="text-muted-foreground mb-4">Add trusted contacts who can support you in crisis situations</p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Contact
            </Button>
          </motion.div>
        )}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowAddModal(false);
                setEditingContact(null);
                setFormData({ name: "", relationship: "", phone: "", email: "", isTrustedContact: false, notificationPreference: 'both' });
              }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg z-50"
            >
              <Card className="p-6 shadow-2xl">
                <h2 className="text-2xl font-bold mb-6">
                  {editingContact ? "Edit Contact" : "Add Emergency Contact"}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name *</label>
                    <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg">
                      <User className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Contact name"
                        className="flex-1 outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Relationship</label>
                    <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg">
                      <Heart className="w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.relationship}
                        onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                        placeholder="e.g., Mother, Friend, Therapist"
                        className="flex-1 outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        className="flex-1 outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email (Optional)</label>
                    <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contact@email.com"
                        className="flex-1 outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="block text-sm font-medium mb-2">Trusted Contact</label>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <input
                        type="checkbox"
                        checked={formData.isTrustedContact}
                        onChange={(e) => setFormData({ ...formData, isTrustedContact: e.target.checked })}
                        className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="block text-sm font-medium mb-2">Notification Preference</label>
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-gray-400" />
                      <select
                        value={formData.notificationPreference}
                        onChange={(e) => setFormData({ ...formData, notificationPreference: e.target.value as 'sms' | 'email' | 'both' })}
                        className="h-8 w-24 text-sm text-gray-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      >
                        <option value="sms">SMS</option>
                        <option value="email">Email</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => {
                        setShowAddModal(false);
                        setEditingContact(null);
                        setFormData({ name: "", relationship: "", phone: "", email: "", isTrustedContact: false, notificationPreference: 'both' });
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={editingContact ? handleUpdateContact : handleAddContact}
                      className="flex-1"
                      disabled={!formData.name || !formData.phone}
                    >
                      {editingContact ? "Update Contact" : "Add Contact"}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </AppLayout>
  );
}