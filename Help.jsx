import React from 'react';
import GlassCard from '@/components/common/GlassCard';
import { 
  HelpCircle, 
  FileText, 
  Shield, 
  Activity,
  Book,
  Mail,
  ExternalLink,
  ChevronRight,
  Play,
  AlertTriangle
} from 'lucide-react';

export default function Help() {
  const resources = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics of using OncoScan AI for thyroid nodule analysis',
      icon: Book,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'TI-RADS Scoring Guide',
      description: 'Detailed guide to ACR TI-RADS classification system',
      icon: FileText,
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      title: 'Understanding AI Results',
      description: 'How to interpret Grad-CAM visualizations and confidence scores',
      icon: Activity,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Compliance & Regulations',
      description: 'FDA requirements and clinical evidence documentation',
      icon: Shield,
      color: 'bg-amber-100 text-amber-600'
    }
  ];

  const faqs = [
    {
      question: 'How accurate is the AI malignancy prediction?',
      answer: 'The OncoScan AI model (v1.0) has an AUC-ROC of 0.839, sensitivity of 88.7%, and specificity of 57.9% on the test dataset. These metrics indicate strong screening capability, but results should always be interpreted alongside clinical judgment.'
    },
    {
      question: 'What image formats are supported?',
      answer: 'OncoScan AI accepts JPEG, PNG, and DICOM file formats. Images should be thyroid ultrasound scans with clear nodule visibility. Maximum file size is 100MB per image.'
    },
    {
      question: 'How is patient data protected?',
      answer: 'All patient data is pseudonymized and encrypted. We comply with HIPAA regulations and use industry-standard security practices. Patient IDs are anonymized before storage.'
    },
    {
      question: 'Can I edit a report after signing?',
      answer: 'No, once a report is digitally signed, it becomes locked for compliance purposes. If corrections are needed, a new addendum report must be created.'
    },
    {
      question: 'What does the Grad-CAM heatmap show?',
      answer: 'The Grad-CAM (Gradient-weighted Class Activation Mapping) visualization highlights image regions that most influenced the AI prediction. Red areas indicate high activation (more influential), while blue areas indicate low activation.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#0C2D5C]">Help & Resources</h1>
        <p className="text-[#9CA3AF] mt-1">Documentation, guides, and support for OncoScan AI</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {resources.map((resource, index) => (
          <GlassCard 
            key={index} 
            padding="default" 
            hover
            className="cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${resource.color}`}>
                <resource.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#0C2D5C]">{resource.title}</h3>
                  <ChevronRight className="w-4 h-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-sm text-[#9CA3AF] mt-1">{resource.description}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Video Tutorial */}
      <GlassCard padding="default">
        <h2 className="text-lg font-semibold text-[#0C2D5C] mb-4">Video Tutorial</h2>
        <div className="aspect-video rounded-xl bg-gray-900 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="w-16 h-16 rounded-full bg-[#0F3F96] flex items-center justify-center mx-auto mb-3 cursor-pointer hover:bg-[#0C2D5C] transition-colors">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
            <p>Complete OncoScan AI Walkthrough</p>
            <p className="text-sm text-gray-500">15 minutes</p>
          </div>
        </div>
      </GlassCard>

      {/* FAQs */}
      <GlassCard padding="default">
        <h2 className="text-lg font-semibold text-[#0C2D5C] mb-4">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group">
              <summary className="flex items-center justify-between cursor-pointer p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <span className="font-medium text-[#0C2D5C]">{faq.question}</span>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF] group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-4 pt-3 pb-1 text-sm text-[#9CA3AF]">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </GlassCard>

      {/* Clinical Disclaimer */}
      <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-800 mb-1">Important Clinical Reminder</p>
            <p className="text-sm text-red-700">
              OncoScan AI is designed to assist radiologists in screening and risk stratification. 
              It is not intended to replace clinical judgment, pathological diagnosis, or other 
              established diagnostic procedures. Always correlate AI findings with clinical presentation 
              and patient history.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <GlassCard padding="default">
        <h2 className="text-lg font-semibold text-[#0C2D5C] mb-4">Need More Help?</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-xl border border-[rgba(15,63,150,0.1)] hover:border-[#0F3F96] transition-colors cursor-pointer">
            <div className="p-3 rounded-xl bg-blue-100">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-[#0C2D5C]">Email Support</p>
              <p className="text-sm text-[#9CA3AF]">support@oncoscan.ai</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 rounded-xl border border-[rgba(15,63,150,0.1)] hover:border-[#0F3F96] transition-colors cursor-pointer">
            <div className="p-3 rounded-xl bg-emerald-100">
              <ExternalLink className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-[#0C2D5C]">Documentation</p>
              <p className="text-sm text-[#9CA3AF]">docs.oncoscan.ai</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

