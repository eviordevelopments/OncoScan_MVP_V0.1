import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import GlassCard from '@/components/common/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { 
  User, 
  Bell, 
  Palette, 
  Shield,
  Cpu,
  FileText,
  Activity,
  Check,
  AlertTriangle,
  ChevronRight,
  Lock
} from 'lucide-react';

export default function Settings() {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState({
    emailOnComplete: true,
    dailySummary: false,
    criticalAlerts: true
  });
  const [displaySettings, setDisplaySettings] = useState({
    theme: 'light',
    fontSize: 'medium'
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {}
    };
    loadUser();
  }, []);

  const { data: auditLogs = [] } = useQuery({
    queryKey: ['audit-logs-settings'],
    queryFn: () => base44.entities.AuditLog.list('-created_date', 50),
  });

  const modelInfo = {
    name: 'OncoScan Binary v1.0',
    architecture: 'ResNet-34',
    status: 'online',
    uptime: '99.8%',
    lastUpdated: '2025-12-06',
    trainingData: 'TN5000 (5,000 images)',
    performance: {
      accuracy: 79.9,
      sensitivity: 88.7,
      specificity: 57.9,
      auroc: 0.839
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0C2D5C]">Settings</h1>
        <p className="text-[#9CA3AF] mt-1">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="w-full justify-start bg-white/50 p-1 rounded-xl">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="model" className="flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            Model
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Compliance
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <GlassCard padding="default">
            <h3 className="text-lg font-semibold text-[#0C2D5C] mb-4">Account Information</h3>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0F3F96] to-[#3C7CE3] flex items-center justify-center text-white text-2xl font-bold">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-semibold text-[#0C2D5C]">{user?.full_name || 'User'}</p>
                <p className="text-sm text-[#9CA3AF]">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[rgba(15,63,150,0.1)] text-[#0F3F96] text-xs font-medium capitalize">
                  {user?.role || 'User'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#0C2D5C]">Full Name</Label>
                <Input value={user?.full_name || ''} disabled className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#0C2D5C]">Email</Label>
                <Input value={user?.email || ''} disabled className="bg-gray-50" />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[rgba(15,63,150,0.08)]">
              <Button variant="outline" className="text-[#D4273E] border-red-200 hover:bg-red-50">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>
          </GlassCard>

          <GlassCard padding="default">
            <h3 className="text-lg font-semibold text-[#0C2D5C] mb-4">Display Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#0C2D5C]">Theme</p>
                  <p className="text-sm text-[#9CA3AF]">Choose your preferred appearance</p>
                </div>
                <div className="flex gap-2">
                  {['light', 'dark'].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setDisplaySettings(s => ({...s, theme}))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        displaySettings.theme === theme 
                          ? 'bg-[#0F3F96] text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#0C2D5C]">Font Size</p>
                  <p className="text-sm text-[#9CA3AF]">Adjust text size for accessibility</p>
                </div>
                <div className="flex gap-2">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setDisplaySettings(s => ({...s, fontSize: size}))}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        displaySettings.fontSize === size 
                          ? 'bg-[#0F3F96] text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <GlassCard padding="default">
            <h3 className="text-lg font-semibold text-[#0C2D5C] mb-4">Email Notifications</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div>
                  <p className="font-medium text-[#0C2D5C]">Case Completion</p>
                  <p className="text-sm text-[#9CA3AF]">Receive email when AI analysis completes</p>
                </div>
                <Switch 
                  checked={notifications.emailOnComplete}
                  onCheckedChange={(v) => setNotifications(n => ({...n, emailOnComplete: v}))}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div>
                  <p className="font-medium text-[#0C2D5C]">Daily Summary</p>
                  <p className="text-sm text-[#9CA3AF]">Daily digest of all case activity</p>
                </div>
                <Switch 
                  checked={notifications.dailySummary}
                  onCheckedChange={(v) => setNotifications(n => ({...n, dailySummary: v}))}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
                <div>
                  <p className="font-medium text-[#0C2D5C]">Critical Alerts</p>
                  <p className="text-sm text-[#9CA3AF]">Immediate alerts for high-risk cases</p>
                </div>
                <Switch 
                  checked={notifications.criticalAlerts}
                  onCheckedChange={(v) => setNotifications(n => ({...n, criticalAlerts: v}))}
                />
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        {/* Model Tab */}
        <TabsContent value="model" className="space-y-4">
          <GlassCard padding="default">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#0C2D5C]">Current Model</h3>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-live" />
                <span className="text-xs font-medium text-emerald-700">Online</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[rgba(15,63,150,0.05)] to-transparent mb-4">
              <div className="p-3 rounded-xl bg-[#0F3F96]">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#0C2D5C]">{modelInfo.name}</p>
                <p className="text-sm text-[#9CA3AF]">{modelInfo.architecture}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-blue-50 text-center">
                <p className="text-xl font-bold text-blue-700">{modelInfo.performance.auroc}</p>
                <p className="text-xs text-blue-600">AUC-ROC</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 text-center">
                <p className="text-xl font-bold text-emerald-700">{modelInfo.performance.sensitivity}%</p>
                <p className="text-xs text-emerald-600">Sensitivity</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 text-center">
                <p className="text-xl font-bold text-amber-700">{modelInfo.performance.specificity}%</p>
                <p className="text-xs text-amber-600">Specificity</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 text-center">
                <p className="text-xl font-bold text-purple-700">{modelInfo.performance.accuracy}%</p>
                <p className="text-xs text-purple-600">Accuracy</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#9CA3AF]">Training Data</p>
                <p className="text-[#0C2D5C]">{modelInfo.trainingData}</p>
              </div>
              <div>
                <p className="text-[#9CA3AF]">Last Updated</p>
                <p className="text-[#0C2D5C]">{modelInfo.lastUpdated}</p>
              </div>
              <div>
                <p className="text-[#9CA3AF]">Uptime</p>
                <p className="text-[#0C2D5C]">{modelInfo.uptime}</p>
              </div>
            </div>
          </GlassCard>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <GlassCard padding="default">
            <h3 className="text-lg font-semibold text-[#0C2D5C] mb-4">Regulatory Information</h3>
            
            <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800 mb-2">FDA NOTICE</p>
                  <p className="text-sm text-red-700 mb-3">
                    OncoScan AI™ is a Software as a Medical Device (SaMD) designed to assist 
                    radiologists in the early screening and risk stratification of thyroid nodules.
                  </p>
                  <ul className="text-sm text-red-700 space-y-1 list-disc pl-4">
                    <li>This system is a screening aid only and does not replace clinical judgment</li>
                    <li>Final diagnosis must be made by a qualified radiologist</li>
                    <li>Do not use for patient self-diagnosis or self-treatment</li>
                    <li>Results should be interpreted with clinical presentation and other diagnostics</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#0F3F96]" />
                  <span className="text-[#0C2D5C]">Terms of Service</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
              </button>
              
              <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#0F3F96]" />
                  <span className="text-[#0C2D5C]">Privacy Policy</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
              </button>
              
              <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-[#0F3F96]" />
                  <span className="text-[#0C2D5C]">Clinical Evidence</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
              </button>
            </div>
          </GlassCard>

          <GlassCard padding="default">
            <h3 className="text-lg font-semibold text-[#0C2D5C] mb-4">Audit Log</h3>
            <p className="text-sm text-[#9CA3AF] mb-4">Recent system activity for compliance tracking</p>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {auditLogs.slice(0, 10).map((log, index) => (
                <div key={log.id || index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <Activity className="w-4 h-4 text-[#9CA3AF]" />
                  <div className="flex-1">
                    <p className="text-sm text-[#0C2D5C]">
                      {log.action?.replace(/_/g, ' ')} 
                      {log.case_id && <span className="text-[#0F3F96]"> #{log.case_id.slice(-4)}</span>}
                    </p>
                    <p className="text-xs text-[#9CA3AF]">{log.user_email} • {log.model_version}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4">
              Export Audit Log
            </Button>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

