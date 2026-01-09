
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AdminDashboard } from './components/AdminDashboard';
import { ChatInterface } from './components/ChatInterface';
import { HRDocument, ChatMessage } from './types';
import { queryHRAssistant } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'employee' | 'admin'>('employee');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [documents, setDocuments] = useState<HRDocument[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Initialize knowledge base
  useEffect(() => {
    const savedDocs = localStorage.getItem('hr_docs');
    const initialDocs: HRDocument[] = [
      {
        id: 'ish-onboarding-permanent-001',
        name: 'IndiaSportsHub - HR Policies & Onboarding Guide',
        content: `IndiaSportsHub - HR Policies & Onboarding Guide

1. VACATION POLICY 2024
Eligibility & Entitlements:
- All full-time employees are entitled to paid vacation days annually.
- Vacation days accrue based on tenure and role level.
- First year: 15 vacation days.
- After 2 years: 18 vacation days.
- After 5 years: 20 vacation days.
- Senior positions: Up to 25 days.

Vacation Request Process:
- Submit vacation request minimum 30 days in advance (unless emergency).
- Request through Employee Portal > Time Off > Vacation.
- Manager approval required.
- HR confirms after manager approval.
- Calendar updated within 24 hours.

Guidelines:
- Cannot carry forward more than 5 days to next fiscal year.
- Unused days expire on December 31st.
- Family emergencies may allow shorter notice periods.
- Public holidays excluded from vacation count.

2. REMOTE WORK GUIDE & SECURITY POLICY
Remote Work Eligibility:
- Available for roles meeting company criteria.
- Not available for: On-site critical roles, new employees (first 6 months), probation period.
- Requires manager and HR approval.

Approved Remote Work Options:
- Full Remote: 5 days/week work from home.
- Hybrid: 3 days office, 2 days remote.
- Coffee Shop/Flexible: allowed with secure VPN - violating security policies without VPN is prohibited. 
- Must work from secure, private location only where you can't be disturbed. 

Security Requirements:
- Use company VPN for all work connections.
- Encrypt all work devices (Full Disk Encryption enabled).
- Close all company applications when not actively working.
- No public Wi-Fi networks allowed.
- Use company-issued equipment only.
- Webcam cover required during non-work usage.

Work Hours & Communication:
- Core hours: 10 AM - 3 PM IST (overlap with team).
- Daily stand-up attendance mandatory.
- Respond to messages within 2 hours during work hours.
- Set status to "Away" when taking breaks.

Equipment Support:
- Company provides laptop, monitor, keyboard, mouse.
- Internet allowance: ₹2,000/month.
- Home office setup reimbursement: ₹15,000 one-time.

3. PARENTAL LEAVE POLICY
Maternity Leave:
- Eligibility: Female employees (after 6 months tenure).
- Duration: 6 months (12 weeks paid + 12 weeks unpaid, optional).
- Can extend up to 12 months total.
- Job security guaranteed.

Process:
- Notify HR minimum 3 months before expected date.
- Submit medical certificate (post 5 months pregnancy).
- Fill Maternity Leave Form in Employee Portal.
- Manager & HR approval.
- HR confirms leave dates.

Paternity Leave:
- Duration: 10 days (paid).
- For biological fathers only.
- Taken within 6 months of child birth.
- Flexible scheduling allowed.

Post-Parental Return:
- Flexible return schedule negotiable.
- Part-time options available for 6 months.
- Same position guaranteed.
- Benefits continue during leave.

Leave Benefits:
- Salary continuation at 100% for paid period.
- Medical insurance coverage maintained.
- Statutory gratuity benefits accrued.
- No performance impact during leave.`,
        type: 'txt',
        category: 'Legal',
        uploadDate: new Date().toISOString()
      },
      {
        id: 'ish-health-comprehensive-2024',
        name: 'IndiaSporthub - Health Benefits & Company Policies.txt',
        content: `INDIASPORTHUB - HEALTH BENEFITS & COMPANY POLICIES 2024

=== HEALTH INSURANCE COVERAGE ===
Comprehensive Health Insurance Plan:
- Company coverage for all full-time employees
- Extended coverage for immediate family members
- Spouse and dependent children eligible
- Coverage effective from Day 1 of employment
- No waiting period for pre-existing conditions
- Lifetime renewable coverage

Coverage Details:
- In-patient hospitalization: 100% coverage
- Out-patient consultations: ₹5,000 annual limit
- Dental procedures: 80% coverage (up to ₹25,000/year)
- Vision care: 80% coverage (up to ₹15,000/year)
- Surgical procedures: 100% coverage
- Emergency care: 24/7 coverage worldwide

=== WELLNESS PROGRAMS ===
Fitness & Wellness:
- Annual gym membership allowance: ₹5,000
- Yoga and meditation classes: Complimentary
- Annual health checkups: Fully covered
- Mental health counseling: 12 sessions/year (Free)
- Nutritionist consultation: Quarterly sessions
- Stress management workshops: Monthly
- Preventive health screening: Annual (Free)

=== PROFESSIONAL DEVELOPMENT ===
Learning & Development:
- Annual learning budget: ₹30,000 per employee
- Online certification courses: Fully funded
- Conference attendance: Approved by manager
- Technical training programs: Company sponsored
- Language courses: Covered up to ₹10,000/year
- Professional certifications: Reimbursement available

=== MEDICAL LEAVE POLICY ===
Medical Leave Entitlements:
- Sick leave: 12 days per calendar year
- Medical emergencies: Additional 5 days
- Hospitalization: Additional leave as needed with certificate
- Work from home during recovery: Allowed with doctor's approval

=== MATERNITY BENEFITS ===
Maternity Leave:
- Duration: 6 months (12 weeks paid + 12 weeks unpaid)
- Extension option: Up to 12 months total
- Full salary continuation during paid period
- Medical insurance maintained throughout
- Flexible return schedule available
- Work from home option post-return: 6 months
- Part-time transition option: 3 months

Post-Natal Benefits:
- Annual health checkup: Covered
- Lactation support program: Available
- Childcare allowance: ₹5,000/month for 12 months
- Crèche facilities: Subsidy available

=== PATERNITY BENEFITS ===
Paternity Leave:
- Duration: 10 days (fully paid)
- Flexible scheduling: Available
- Can be taken within 6 months of child birth
- Same position guaranteed upon return

=== DEPENDENT BENEFITS ===
Family Coverage:
- Spouse health insurance: Full coverage
- Children (up to age 23): Covered if dependent
- Parents: Medical insurance (if financially dependent)
- Emergency medical evacuation: Coverage available

=== DISABILITY COVERAGE ===
Disability Insurance:
- Short-term disability: Up to 90 days (80% salary)
- Long-term disability: Beyond 90 days (60% salary)
- Occupational therapy: Fully covered
- Rehabilitation services: Covered
- Return-to-work programs: Supported

=== LIFE INSURANCE ===
Life Insurance Coverage:
- Life insurance: 5 times annual salary (minimum ₹50 lakhs)
- Spouse nominee benefit: Full amount
- Children nominee benefit: Full amount
- Accidental death benefit: Double the amount
- Coverage maintained during leave

=== MEDICAL CLAIM PROCEDURES ===
How to Claim Health Benefits:

1. Out-Patient Claims (OPD):
   - Visit empaneled hospital/clinic
   - Carry employee ID and health card
   - Get itemized bill and receipts
   - Submit within 30 days to HR
   - Reimbursement within 7-10 days

2. In-Patient Claims (IPD):
   - Notify HR before admission if planned
   - For emergencies, notify within 24 hours
   - Hospital processes claim directly
   - Employee pays deductible only
   - Approval usually within 24 hours

3. Cashless Treatment:
   - Available at empaneled network hospitals
   - Insurance company settles directly
   - No upfront payment needed
   - Valid only with authorization letter

4. Required Documents:
   - Original medical bills/receipts
   - Doctor's prescription/certificate
   - Hospital/clinic invoice
   - Employee ID proof
   - Claim form (signed)
   - Lab reports (if applicable)

=== ELIGIBILITY CRITERIA ===
Benefits Eligibility:
- Full-time permanent employees: All benefits
- Contract employees: Limited benefits (decide with HR)
- Probation period: After 3 months employment
- Part-time employees: Prorated benefits
- New joiners: Coverage from Day 1
- Resigned employees: Coverage until last day

=== EMPLOYEE ASSISTANCE PROGRAM (EAP) ===
EAP Services:
- 24/7 counseling hotline: Available
- Mental health support: 12 free sessions/year
- Stress management: Workshops monthly
- Crisis intervention: Immediate support
- Family counseling: Available
- Substance abuse support: Confidential
- Legal assistance: Basic consultation free
- Financial counseling: Available

=== PREVENTIVE CARE ===
Annual Health Screening:
- Health checkup: Annual (Fully covered)
- Blood work: Annual
- Blood pressure monitoring: Regular checks
- BMI assessment: Annual
- Vision testing: Annual
- Dental checkup: Annual
- Vaccination: As per age/requirement

=== SPECIAL CIRCUMSTANCES ===
Additional Coverage:
- Pregnancy-related care: Fully covered
- Newborn benefits: First year coverage
- Chronic disease management: Ongoing support
- Cancer treatment: 100% coverage
- Organ transplant: Covered
- Dialysis: Unlimited sessions
- Critical illness: Enhanced coverage

=== POLICY AMENDMENTS ===
Important Notes:
- Policies subject to change with 30 days notice
- Changes apply to new policies only
- Existing coverage continues as per terms
- Annual review in January
- Updates shared via Employee Portal
- FAQ available on intranet

=== CONTACT INFORMATION ===
For Health Benefits Support:
- HR Department: hr@indiasporthub.com
- Health Insurance Team: health@indiasporthub.com
- Employee Support: 1800-123-SPORT
- Portal: employee.indiasporthub.com
- Emergency Line: +91-XXXX-XXXXX

Last Updated: January 2024
Valid From: January 2024 - December 2024`,
        type: 'txt',
        category: 'Benefits',
        uploadDate: new Date().toISOString()
      }
    ];

    if (savedDocs) {
      const parsed = JSON.parse(savedDocs);
      const merged = [...initialDocs];
      parsed.forEach((pDoc: HRDocument) => {
        if (!initialDocs.find(iDoc => iDoc.id === pDoc.id)) {
          merged.push(pDoc);
        }
      });
      setDocuments(merged);
      localStorage.setItem('hr_docs', JSON.stringify(merged));
    } else {
      setDocuments(initialDocs);
      localStorage.setItem('hr_docs', JSON.stringify(initialDocs));
    }
  }, []);

  const handleSendMessage = async (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMessage]);

    const assistantMsgId = (Date.now() + 1).toString();
    const loadingMessage: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: 'Thinking...',
      isLoading: true
    };
    
    setMessages(prev => [...prev, loadingMessage]);

    const response = await queryHRAssistant(text, documents);

    setMessages(prev => 
      prev.map(msg => 
        msg.id === assistantMsgId 
          ? { 
              ...msg, 
              content: response.answer, 
              category: response.category, 
              citations: response.citations,
              isLoading: false 
            } 
          : msg
      )
    );
  };

  const handleAddDocument = (doc: HRDocument) => {
    const updated = [...documents, doc];
    setDocuments(updated);
    localStorage.setItem('hr_docs', JSON.stringify(updated));
  };

  const handleUpdateDocument = (updatedDoc: HRDocument) => {
    const updated = documents.map(d => d.id === updatedDoc.id ? updatedDoc : d);
    setDocuments(updated);
    localStorage.setItem('hr_docs', JSON.stringify(updated));
  };

  const handleDeleteDocument = (id: string) => {
    const updated = documents.filter(d => d.id !== id);
    setDocuments(updated);
    localStorage.setItem('hr_docs', JSON.stringify(updated));
  };

  const handleAdminAuth = (password: string) => {
    if (password === 'admin123') {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setView('employee');
  };

  return (
    <Layout 
      currentView={view} 
      onViewChange={setView}
      isAdminAuthenticated={isAdminAuthenticated}
      onAdminAuth={handleAdminAuth}
      onLogout={handleLogout}
    >
      {view === 'admin' ? (
        isAdminAuthenticated ? (
          <AdminDashboard 
            documents={documents} 
            onAdd={handleAddDocument} 
            onUpdate={handleUpdateDocument}
            onDelete={handleDeleteDocument} 
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">Authentication required to access the Admin Portal.</p>
          </div>
        )
      ) : (
        <ChatInterface 
          messages={messages} 
          onSend={handleSendMessage} 
        />
      )}
    </Layout>
  );
};

export default App;
