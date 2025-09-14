import React from 'react';
// Types handled inline to avoid import issues
import { InfoCard } from '@/components/shared/InfoCard';

export function SupportTab({
  school,
  onSave,
}: {
  school: any;
  onSave: (vals: any) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <InfoCard
        title="High Priority"
        columns={2}
        fields={[
          { key: 'status', label: 'Status', type: 'text', value: school?.status ?? '' },
          { key: 'ssjStage', label: 'SSJ Stage', type: 'text', value: (school as any)?.ssjStage ?? '' },
          { key: 'ssjProjectedOpen', label: 'Projected Open Date', type: 'date', value: (school as any)?.ssjProjectedOpen ?? '' },
          { key: 'ssjReadinessRating', label: 'Readiness Rating', type: 'text', value: (school as any)?.ssjReadinessRating ?? '' },
          { key: 'inactiveFlag', label: 'Inactive', type: 'toggle', value: !!school?.inactiveFlag },
        ]}
        onSave={onSave}
      />

      <InfoCard
        title="Target Geography"
        columns={2}
        fields={[
          { key: 'ssjTargetCity', label: 'Target City', type: 'text', value: (school as any)?.ssjTargetCity ?? '' },
          { key: 'ssjTargetState', label: 'Target State', type: 'text', value: (school as any)?.ssjTargetState ?? '' },
        ]}
        onSave={onSave}
      />
      <InfoCard
        title="Timeline & Milestones"
        columns={3}
        fields={[
          { key: 'ssjOriginalProjectedOpenDate', label: 'Original Projected Open Date', type: 'date', value: (school as any)?.ssjOriginalProjectedOpenDate ?? '' },
          { key: 'ssjProjectedOpen', label: 'Projected Open Date', type: 'date', value: (school as any)?.ssjProjectedOpen ?? '' },
          { key: 'openDate', label: 'Open Date', type: 'date', value: (school as any)?.openDate ?? '' },
          { key: 'enteredVisioningDate', label: 'Entered Visioning', type: 'date', value: (school as any)?.enteredVisioningDate ?? '' },
          { key: 'enteredPlanningDate', label: 'Entered Planning', type: 'date', value: (school as any)?.enteredPlanningDate ?? '' },
          { key: 'enteredStartupDate', label: 'Entered Startup', type: 'date', value: (school as any)?.enteredStartupDate ?? '' },
        ]}
        onSave={onSave}
      />

      <InfoCard
        title="Facility"
        columns={2}
        fields={[
          { key: 'ssjFacility', label: 'Facility', type: 'text', value: (school as any)?.ssjFacility ?? '' },
          { key: 'ssjB4GStatus', label: 'Building4Good Status', type: 'text', value: (school as any)?.ssjB4GStatus ?? '' },
          { key: 'ssjDateSharedWithN4G', label: 'Date shared with N4G', type: 'date', value: (school as any)?.ssjDateSharedWithN4G ?? '' },
          { key: 'building4GoodFirm', label: 'B4G Firm/Attorney', type: 'text', value: (school as any)?.building4GoodFirm ?? '' },
        ]}
        onSave={onSave}
      />

      <InfoCard
        title="Funding & Financial Planning"
        columns={2}
        fields={[
          { key: 'ssjFundingGap', label: 'Funding Gap', type: 'text', value: (school as any)?.ssjFundingGap ?? '' },
          { key: 'ssjAmountRaised', label: 'Amount Raised', type: 'text', value: (school as any)?.ssjAmountRaised ?? '' },
          { key: 'ssjLoanApprovedAmount', label: 'Loan Approved Amount', type: 'text', value: (school as any)?.ssjLoanApprovedAmount ?? '' },
          { key: 'ssjLoanEligibility', label: 'Loan Eligibility', type: 'text', value: (school as any)?.ssjLoanEligibility ?? '' },
          { key: 'ssjViableFundingPath', label: 'Viable Funding Path', type: 'text', value: (school as any)?.ssjViableFundingPath ?? '' },
          { key: 'ssjFundraisingNarrative', label: 'Fundraising Narrative', type: 'textarea', value: (school as any)?.ssjFundraisingNarrative ?? '' },
          { key: 'ssjPlanningForWFFunding', label: 'Planning for WF Funding', type: 'text', value: (school as any)?.ssjPlanningForWFFunding ?? '' },
          { key: 'ssjBudgetReady', label: 'Budget Ready', type: 'text', value: (school as any)?.ssjBudgetReady ?? '' },
          { key: 'budgetUtility', label: 'Budget Utility', type: 'text', value: (school as any)?.budgetUtility ?? '' },
          { key: 'qbo', label: 'QBO', type: 'text', value: (school as any)?.qbo ?? '' },
          { key: 'billComAccount', label: 'Bill.com Account', type: 'text', value: (school as any)?.billComAccount ?? '' },
          { key: 'bookkeeper', label: 'Bookkeeper/Accountant', type: 'text', value: (school as any)?.bookkeeper ?? '' },
          { key: 'budgetLink', label: 'Budget Link', type: 'text', value: (school as any)?.budgetLink ?? '' },
        ]}
        onSave={onSave}
      />

      <InfoCard
        title="Albums"
        columns={2}
        fields={[
          { key: 'planningAlbum', label: 'Planning Album', type: 'text', value: (school as any)?.planningAlbum ?? '' },
          { key: 'visioningAlbum', label: 'Visioning Album', type: 'text', value: (school as any)?.visioningAlbum ?? '' },
          { key: 'visioningAlbumComplete', label: 'Visioning Album Complete', type: 'text', value: (school as any)?.visioningAlbumComplete ?? '' },
        ]}
        onSave={onSave}
      />

      <InfoCard
        title="Cohorts"
        columns={2}
        fields={[
          { key: 'cohorts', label: 'Cohorts', type: 'multiselect', value: (school as any)?.cohorts ?? [], placeholder: 'Comma separated list' },
          { key: 'ssjOpsGuideTrack', label: 'Ops Guide Track', type: 'multiselect', value: (school as any)?.ssjOpsGuideTrack ?? [], placeholder: 'Comma separated list' },
          { key: 'selfReflection', label: 'Self Reflection', type: 'textarea', value: (school as any)?.selfReflection ?? '' },
        ]}
        onSave={onSave}
      />

      <InfoCard
        title="Systems"
        columns={2}
        fields={[
          { key: 'googleVoice', label: 'Google Voice', type: 'text', value: (school as any)?.googleVoice ?? '' },
          { key: 'admissionsSystem', label: 'Admissions System', type: 'text', value: (school as any)?.admissionsSystem ?? '' },
          { key: 'websiteTool', label: 'Website Tool', type: 'text', value: (school as any)?.websiteTool ?? '' },
          { key: 'logoDesigner', label: 'Logo Designer', type: 'text', value: (school as any)?.logoDesigner ?? '' },
          { key: 'transparentClassroom', label: 'Transparent Classroom', type: 'text', value: (school as any)?.transparentClassroom ?? '' },
          { key: 'tcAdmissions', label: 'TC Admissions', type: 'text', value: (school as any)?.tcAdmissions ?? '' },
          { key: 'tcRecordkeeping', label: 'TC Recordkeeping', type: 'text', value: (school as any)?.tcRecordkeeping ?? '' },
          { key: 'gusto', label: 'Gusto', type: 'text', value: (school as any)?.gusto ?? '' },
          { key: 'businessInsurance', label: 'Business Insurance', type: 'text', value: (school as any)?.businessInsurance ?? '' },
          { key: 'nameSelectionProposal', label: 'Name Selection Proposal', type: 'text', value: (school as any)?.nameSelectionProposal ?? '' },
          { key: 'trademarkFiled', label: 'Trademark Filed', type: 'text', value: (school as any)?.trademarkFiled ?? '' },
          { key: 'googleWorkspacePath', label: 'Google Workspace OU Path', type: 'text', value: (school as any)?.googleWorkspacePath ?? '' },
        ]}
        onSave={onSave}
      />

      <InfoCard
        title="Misc."
        columns={2}
        fields={[
          { key: 'ssjHasETLPartner', label: 'Has ETL Partner', type: 'text', value: (school as any)?.ssjHasETLPartner ?? '' },
          { key: 'ssjEnrollmentOnTrack', label: 'Enrollment On Track', type: 'text', value: (school as any)?.ssjEnrollmentOnTrack ?? '' },
          { key: 'ssjBoardDevelopment', label: 'Board Development', type: 'text', value: (school as any)?.ssjBoardDevelopment ?? '' },
          { key: 'ssjNameReserved', label: 'Name Reserved', type: 'text', value: (school as any)?.ssjNameReserved ?? '' },
          { key: 'ssjNextBigDecision', label: 'Next Big Decision', type: 'textarea', value: (school as any)?.ssjNextBigDecision ?? '' },
        ]}
        onSave={onSave}
      />
    </div>
  );
}
