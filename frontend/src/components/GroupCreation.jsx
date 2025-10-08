import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Check,
  Users,
  Camera,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";

const GroupCreation = ({ 
  contacts, 
  effectiveTheme, 
  onClose, 
  onCreateGroup 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [step, setStep] = useState(1); // 1: Select contacts, 2: Group details

  // Filter contacts (exclude documents and groups - only show individual contacts for group creation)
  const availableContacts = useMemo(() => {
    const filtered = contacts.filter(contact => !contact.isDocument && !contact.isGroup);
    // Remove duplicates based on ID
    const uniqueContacts = filtered.filter((contact, index, self) => 
      index === self.findIndex(c => c.id === contact.id)
    );
    return uniqueContacts;
  }, [contacts]);

  const filteredContacts = useMemo(() => 
    availableContacts.filter(contact => 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), 
    [availableContacts, searchTerm]
  );

  const handleContactToggle = (contact) => {
    setSelectedContacts(prev => {
      const isSelected = prev.some(c => c.id === contact.id);
      if (isSelected) {
        return prev.filter(c => c.id !== contact.id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const handleNext = () => {
    if (selectedContacts.length > 0) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedContacts.length > 0) {
      const newGroup = {
        id: Date.now(),
        name: groupName,
        description: groupDescription,
        members: selectedContacts,
        isGroup: true,
        avatar: null,
        createdBy: "You",
        createdAt: new Date(),
      };
      onCreateGroup(newGroup);
      onClose();
    }
  };

  const removeSelectedContact = (contactId) => {
    setSelectedContacts(prev => prev.filter(c => c.id !== contactId));
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed inset-0 ${effectiveTheme.primary} flex flex-col h-screen w-screen z-50`}
    >
      {/* Header */}
      <div className={`${effectiveTheme.secondary} border-b ${effectiveTheme.border} p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={step === 1 ? onClose : handleBack}
              className={`p-2 rounded-full hover:${effectiveTheme.hover} transition-colors`}
            >
              {step === 1 ? (
                <X className={`w-5 h-5 ${effectiveTheme.text}`} />
              ) : (
                <ChevronLeft className={`w-5 h-5 ${effectiveTheme.text}`} />
              )}
            </button>
            <div>
              <h2 className={`text-lg font-semibold ${effectiveTheme.text}`}>
                {step === 1 ? "New Group" : "Group Details"}
              </h2>
              <p className={`text-sm ${effectiveTheme.textSecondary}`}>
                {step === 1 
                  ? `${selectedContacts.length} of ${availableContacts.length} selected`
                  : "Add group name and description"
                }
              </p>
            </div>
          </div>
          
          {/* Create Group Button - Top Right */}
          {step === 1 && selectedContacts.length > 0 && (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Create Group</span>
            </button>
          )}
          
          {step === 2 && (
            <button
              onClick={handleCreateGroup}
              disabled={!groupName.trim()}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                groupName.trim()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </button>
          )}
        </div>
      </div>

      {step === 1 ? (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Search Bar */}
          <div className="p-4 flex-shrink-0">
            <div className={`relative ${effectiveTheme.searchBg} rounded-lg`}>
              <Search
                className={`absolute left-3 top-3 w-4 h-4 ${effectiveTheme.textSecondary}`}
              />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-transparent ${effectiveTheme.text} placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
              />
            </div>
          </div>

          {/* Selected Contacts Pills */}
          {selectedContacts.length > 0 && (
            <div className="px-4 pb-4 flex-shrink-0">
              <div className="flex flex-wrap gap-2">
                {selectedContacts.map((contact) => (
                  <motion.div
                    key={contact.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={`flex items-center space-x-2 ${effectiveTheme.accent} px-3 py-1 rounded-full`}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                      {contact.name.charAt(0)}
                    </div>
                    <span className={`text-sm ${effectiveTheme.text}`}>
                      {contact.name.split(' ')[0]}
                    </span>
                    <button
                      onClick={() => removeSelectedContact(contact.id)}
                      className="p-1 hover:bg-red-500 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="px-4">
            {filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8">
                <Users className={`w-16 h-16 ${effectiveTheme.textSecondary} mb-4`} />
                <h3 className={`text-lg font-medium ${effectiveTheme.text} mb-2`}>
                  {searchTerm ? "No contacts found" : "No contacts available"}
                </h3>
                <p className={`text-sm ${effectiveTheme.textSecondary} text-center`}>
                  {searchTerm 
                    ? "Try adjusting your search terms"
                    : `Total contacts: ${contacts.length}, Available: ${availableContacts.length}`
                  }
                </p>
              </div>
            ) : (
              filteredContacts.map((contact) => {
                const isSelected = selectedContacts.some(c => c.id === contact.id);
                return (
                  <motion.div
                    key={contact.id}
                    whileHover={{ x: 4 }}
                    className={`flex items-center space-x-3 p-4 cursor-pointer border-b ${effectiveTheme.border} ${
                      isSelected 
                        ? `${effectiveTheme.accent} bg-blue-50` 
                        : `hover:${effectiveTheme.hover}`
                    }`}
                    onClick={() => handleContactToggle(contact)}
                  >
                  {/* Avatar */}
                  <div className="relative">
                    {contact.avatar ? (
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                        {contact.name.charAt(0)}
                      </div>
                    )}
                    {contact.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1">
                    <h3 className={`font-semibold ${effectiveTheme.text}`}>
                      {contact.name}
                    </h3>
                    <p className={`text-sm ${effectiveTheme.textSecondary}`}>
                      {contact.lastMessage}
                    </p>
                  </div>

                  {/* Selection Indicator */}
                  <div className="flex-shrink-0">
                    {isSelected ? (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className={`w-6 h-6 border-2 ${effectiveTheme.border} rounded-full`} />
                    )}
                  </div>
                </motion.div>
              );
            })
            )}
            </div>
          </div>

        </div>
      ) : (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Group Details Form */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="p-4 space-y-6">
              {/* Group Avatar */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                  <Camera className="w-8 h-8 text-gray-500" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${effectiveTheme.text}`}>Group Photo</h3>
                  <p className={`text-sm ${effectiveTheme.textSecondary}`}>
                    Add a photo to make your group easy to identify
                  </p>
                </div>
              </div>

              {/* Group Name */}
              <div>
                <label className={`block text-sm font-medium ${effectiveTheme.text} mb-2`}>
                  Group Name *
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name"
                  className={`w-full px-4 py-3 ${effectiveTheme.inputBg} ${effectiveTheme.text} rounded-lg border ${effectiveTheme.border} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  maxLength={50}
                />
                <p className={`text-xs ${effectiveTheme.textSecondary} mt-1`}>
                  {groupName.length}/50 characters
                </p>
              </div>

              {/* Group Description */}
              <div>
                <label className={`block text-sm font-medium ${effectiveTheme.text} mb-2`}>
                  Group Description (Optional)
                </label>
                <textarea
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  placeholder="Add a description for your group"
                  rows={3}
                  className={`w-full px-4 py-3 ${effectiveTheme.inputBg} ${effectiveTheme.text} rounded-lg border ${effectiveTheme.border} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none`}
                  maxLength={200}
                />
                <p className={`text-xs ${effectiveTheme.textSecondary} mt-1`}>
                  {groupDescription.length}/200 characters
                </p>
              </div>

              {/* Group Settings */}
              <div>
                <h3 className={`font-medium ${effectiveTheme.text} mb-3`}>
                  Group Settings
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`text-sm font-medium ${effectiveTheme.text}`}>Send messages</h4>
                      <p className={`text-xs ${effectiveTheme.textSecondary}`}>Who can send messages to this group</p>
                    </div>
                    <select className={`px-3 py-2 ${effectiveTheme.inputBg} ${effectiveTheme.text} rounded-lg border ${effectiveTheme.border} text-sm`}>
                      <option>All members</option>
                      <option>Admins only</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`text-sm font-medium ${effectiveTheme.text}`}>Edit group info</h4>
                      <p className={`text-xs ${effectiveTheme.textSecondary}`}>Who can edit group name and description</p>
                    </div>
                    <select className={`px-3 py-2 ${effectiveTheme.inputBg} ${effectiveTheme.text} rounded-lg border ${effectiveTheme.border} text-sm`}>
                      <option>All members</option>
                      <option>Admins only</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Selected Members Preview */}
              <div>
                <h3 className={`font-medium ${effectiveTheme.text} mb-3`}>
                  Members ({selectedContacts.length})
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
                  {selectedContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                        {contact.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <span className={`text-sm font-medium ${effectiveTheme.text}`}>
                          {contact.name}
                        </span>
                        <p className={`text-xs ${effectiveTheme.textSecondary}`}>
                          {contact.lastMessage}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 ${effectiveTheme.accent} rounded-full`}>
                        Member
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacy Settings */}
              <div>
                <h3 className={`font-medium ${effectiveTheme.text} mb-3`}>
                  Privacy & Security
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`text-sm font-medium ${effectiveTheme.text}`}>Group visibility</h4>
                      <p className={`text-xs ${effectiveTheme.textSecondary}`}>Who can find this group</p>
                    </div>
                    <select className={`px-3 py-2 ${effectiveTheme.inputBg} ${effectiveTheme.text} rounded-lg border ${effectiveTheme.border} text-sm`}>
                      <option>Members only</option>
                      <option>Public</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`text-sm font-medium ${effectiveTheme.text}`}>Disappearing messages</h4>
                      <p className={`text-xs ${effectiveTheme.textSecondary}`}>Messages disappear after selected time</p>
                    </div>
                    <select className={`px-3 py-2 ${effectiveTheme.inputBg} ${effectiveTheme.text} rounded-lg border ${effectiveTheme.border} text-sm`}>
                      <option>Off</option>
                      <option>24 hours</option>
                      <option>7 days</option>
                      <option>90 days</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional space for scrolling demonstration */}
              <div className="pb-8">
                <h3 className={`font-medium ${effectiveTheme.text} mb-3`}>
                  Additional Options
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className={`text-sm ${effectiveTheme.text}`}>Send notification when group is created</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className={`text-sm ${effectiveTheme.text}`}>Add group to favorites</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className={`text-sm ${effectiveTheme.text}`}>Enable group notifications</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default GroupCreation;