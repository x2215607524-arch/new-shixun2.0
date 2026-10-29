import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserOverview from "./pages/UserOverview";
import UserDashboard from "./pages/UserDashboard";
import UserExperiments from "./pages/UserExperiments";
import UserExams from "./pages/UserExams";
import UserDatasets from "./pages/UserDatasets";
import UserAIAssistant from "./pages/UserAIAssistant";
import UserAIAssistantStudio from "./pages/UserAIAssistantStudio";
import UserAIAgents from "./pages/UserAIAgents";
import UserAIAgentsStudio from "./pages/UserAIAgentsStudio";
import UserProjects from "./pages/UserProjects";
import UserPractices from "./pages/UserPractices";
import SkillBuilder from "./pages/SkillBuilder";
import PracticeChat from "./pages/PracticeChat";
import AICompetition from "./pages/AICompetition";
import CloudCompetition from "./pages/CloudCompetition";
import CompetitionList from "./pages/CompetitionList";
import UserCenterLayout from "./layouts/UserCenterLayout";
import UserCenterProfile from "./pages/user/UserCenterProfile";
import UserCenterQuota from "./pages/user/UserCenterQuota";
import UserCenterProjects from "./pages/user/UserCenterProjects";
import UserCenterFavorites from "./pages/user/UserCenterFavorites";
import UserCenterHistory from "./pages/user/UserCenterHistory";
import UserCenterSecurity from "./pages/user/UserCenterSecurity";
import UserCenterMessages from "./pages/user/UserCenterMessages";
import UserPersona from "./pages/user/UserPersona";
import MyLearning from "./pages/user/MyLearning";
import AdminAudit from "./pages/admin/AdminAudit";
import { 
  AdminSecurity, 
  AdminPublicCloud, 
  AdminPrivateCloud, 
  AdminIT, 
  AdminIP, 
  AdminPermissions, 
  AdminSystem,
  AdminResources,
  AdminTenants,
  AdminAIQuota,
  AdminCompetitions,
  AdminAICenter,
  AdminNetworkSimulation
} from "./pages/admin/AdminPages";
import { 
  SecurityLayout, PublicCloudLayout, PrivateCloudLayout, 
  ITLayout, IPLayout, PermissionsLayout, SystemLayout 
} from "./layouts/AdminLayouts";
import {
  SecurityPolicies, SecurityVulnerabilities, SecurityLogs,
  PublicCloudInstances, PublicCloudStorage, PublicCloudBilling,
  PrivateCloudNodes, PrivateCloudVMs, PrivateCloudClusters,
  ITAssets, ITLicenses, ITTickets,
  IPSubnets, IPAllocations, IPConflicts,
  PermissionsUsers, PermissionsRoles, PermissionsPolicies,
  SystemConfig, SystemCron, SystemLogs
} from "./pages/admin/AdminSubPages";
import SystemTenants from "./pages/admin/SystemTenants";
import SystemBilling from "./pages/admin/SystemBilling";
import SystemResources from "./pages/admin/SystemResources";
import SystemSecurity from "./pages/admin/SystemSecurity";
import AdminSystemPage from "./pages/admin/AdminSystemPage";
import CompetitionCockpit from "./pages/admin/CompetitionCockpit";

import LoginUser from "./pages/LoginUser";
import LoginTeacher from "./pages/LoginTeacher";
import LoginAdmin from "./pages/LoginAdmin";

import TeacherLayout from "./layouts/TeacherLayout";
import TeacherHome from "./pages/teacher/TeacherHome";
import TeacherQuestions from "./pages/teacher/TeacherQuestions";
import TeacherPapers from "./pages/teacher/TeacherPapers";
import TeacherResources from "./pages/teacher/TeacherResources";
import TeacherCourseManage from "./pages/teacher/TeacherCourseManage";
import TeacherDatasetDetail from "./pages/teacher/TeacherDatasetDetail";
import TeacherExperimentIDE from "./pages/teacher/TeacherExperimentIDE";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import TeacherAssignmentPreview from "./pages/teacher/TeacherAssignmentPreview";
import TeacherAntiCheat from "./pages/teacher/TeacherAntiCheat";
import TeacherCenter from "./pages/teacher/TeacherCenter";
import TeacherStatistics from "./pages/teacher/TeacherStatistics";
import TeacherBilling from "./pages/teacher/TeacherBilling";
import TeacherAIQuota from "./pages/teacher/TeacherAIQuota";
import TeacherAudit from "./pages/teacher/TeacherAudit";
import TeacherLogs from "./pages/teacher/TeacherLogs";
import TeacherExamRules from "./pages/teacher/TeacherExamRules";
import TeacherGrading from "./pages/teacher/TeacherGrading";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Public Website */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="competition" element={<CompetitionList />} />
          <Route path="competition/:competitionId" element={<CompetitionList />} />
          <Route path="competition/:competitionId/register" element={<CompetitionList />} />
          <Route path="competition/ai" element={<AICompetition />} />
          <Route path="competition/cloud" element={<CloudCompetition />} />
        </Route>
        
        {/* Login Page */}
        <Route path="/login" element={<Login />} />
        <Route path="/login/user" element={<LoginUser />} />
        <Route path="/login/teacher" element={<LoginTeacher />} />
        <Route path="/login/admin" element={<LoginAdmin />} />

        {/* Skill Builder & Practice Chat (Full Screen) */}
        <Route path="/skill-builder" element={<SkillBuilder />} />
        <Route path="/practice-chat" element={<PracticeChat />} />
        <Route path="/admin/competitions/:competitionId/cockpit" element={<CompetitionCockpit />} />

        {/* Full-screen teacher assignment preview without top layout header */}
        <Route path="/teacher/course/:id/assignment-preview" element={<TeacherAssignmentPreview />} />

        {/* Teacher Dashboard */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<TeacherHome />} />
          <Route path="course/:id" element={<TeacherCourseManage />} />
          <Route path="dataset/:id" element={<TeacherDatasetDetail />} />
          <Route path="course/:id/experiment/:experimentId" element={<TeacherExperimentIDE />} />
          <Route path="questions" element={<TeacherQuestions />} />
          <Route path="papers" element={<TeacherPapers />} />
          <Route path="resources" element={<TeacherResources />} />
          <Route path="students" element={<TeacherStudents />} />
          <Route path="statistics" element={<TeacherStatistics />} />
          <Route path="anticheat" element={<TeacherAntiCheat />} />
          <Route path="center" element={<TeacherCenter />} />
          <Route path="billing" element={<TeacherBilling />} />
          <Route path="aiquota" element={<TeacherAIQuota />} />
          <Route path="audit" element={<TeacherAudit />} />
          <Route path="logs" element={<TeacherLogs />} />
          <Route path="examrules" element={<TeacherExamRules />} />
          <Route path="grading" element={<TeacherGrading />} />
        </Route>

        {/* User Dashboard */}
        <Route path="/user" element={<DashboardLayout type="user" />}>
          <Route index element={<UserOverview />} />
          <Route path="center" element={<UserCenterLayout />}>
            <Route index element={<Navigate to="/user/center/profile" replace />} />
            <Route path="profile" element={<UserCenterProfile />} />
            <Route path="quota" element={<UserCenterQuota />} />
            <Route path="projects" element={<UserCenterProjects />} />
            <Route path="favorites" element={<UserCenterFavorites />} />
            <Route path="history" element={<UserCenterHistory />} />
            <Route path="security" element={<UserCenterSecurity />} />
            <Route path="messages" element={<UserCenterMessages />} />
          </Route>
          <Route path="projects" element={<UserProjects />} />
          <Route path="practices" element={<UserPractices />} />
          <Route path="datasets" element={<UserDatasets />} />
          <Route path="ai/assistant" element={<UserAIAssistant />} />
          <Route path="ai/assistant/studio" element={<UserAIAssistantStudio />} />
          <Route path="ai/agents" element={<UserAIAgents />} />
          <Route path="ai/agents/studio" element={<UserAIAgentsStudio />} />
          <Route path="courses" element={<UserDashboard />} />
          <Route path="experiments" element={<UserExperiments />} />
          <Route path="exams" element={<UserExams />} />
          <Route path="persona" element={<UserPersona />} />
          <Route path="mylearning" element={<MyLearning />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="/admin" element={<DashboardLayout type="admin" />}>
          <Route index element={<Navigate to="/admin/audit" replace />} />
          <Route path="ai/*" element={<Navigate to="/admin/audit" replace />} />
          <Route path="security" element={<SecurityLayout />}>
            <Route index element={<AdminSecurity />} />
            <Route path="policies" element={<SecurityPolicies />} />
            <Route path="vulnerabilities" element={<SecurityVulnerabilities />} />
            <Route path="logs" element={<SecurityLogs />} />
          </Route>
          <Route path="public-cloud" element={<PublicCloudLayout />}>
            <Route index element={<AdminPublicCloud />} />
            <Route path="instances" element={<PublicCloudInstances />} />
            <Route path="storage" element={<PublicCloudStorage />} />
            <Route path="billing" element={<PublicCloudBilling />} />
          </Route>
          <Route path="network-simulation" element={<AdminNetworkSimulation />} />
          <Route path="private-cloud" element={<PrivateCloudLayout />}>
            <Route index element={<AdminPrivateCloud />} />
            <Route path="nodes" element={<PrivateCloudNodes />} />
            <Route path="vms" element={<PrivateCloudVMs />} />
            <Route path="clusters" element={<PrivateCloudClusters />} />
          </Route>
          <Route path="it" element={<ITLayout />}>
            <Route index element={<AdminIT />} />
            <Route path="assets" element={<ITAssets />} />
            <Route path="licenses" element={<ITLicenses />} />
            <Route path="tickets" element={<ITTickets />} />
          </Route>
          <Route path="ip" element={<IPLayout />}>
            <Route index element={<AdminIP />} />
            <Route path="subnets" element={<IPSubnets />} />
            <Route path="allocations" element={<IPAllocations />} />
            <Route path="conflicts" element={<IPConflicts />} />
          </Route>
          <Route path="audit" element={<AdminAudit />} />
          <Route path="resources" element={<AdminResources />} />
          <Route path="tenants" element={<AdminTenants />} />
          <Route path="ai-quota" element={<AdminAIQuota />} />
          <Route path="competitions" element={<AdminCompetitions />} />
          <Route path="ai-center" element={<AdminAICenter />} />
          <Route path="permissions" element={<AdminPermissions />} />
          <Route path="system" element={<AdminSystemPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
