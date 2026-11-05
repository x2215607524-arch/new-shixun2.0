import { useLocation, useNavigate } from 'react-router-dom';
import ProjectDetail, { type ProjectData } from '@/components/ProjectDetail';
import ProjectIDE from '@/components/ProjectIDE';

export default function TeacherProjectPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { project?: ProjectData; returnTo?: string; returnState?: Record<string, unknown> } | null;
  const onBack = () => navigate(state?.returnTo || '/teacher', {
    state: { ...state?.returnState, activeSubTab: 'project' },
    replace: true,
  });

  if (!state?.project) {
    return <div className="flex-1 bg-[#f5f6f8] p-8 text-center">
      <p className="mb-4 text-neutral-600">请从项目列表选择要预览的项目</p>
      <button onClick={onBack} className="text-[#fa541c] cursor-pointer">返回项目列表</button>
    </div>;
  }

  if (new URLSearchParams(location.search).get('view') === 'workspace') {
    return <ProjectIDE projectTitle={state.project.title} showAIAssistant={false} showChecks onBack={() => navigate(-1)} />;
  }

  return <div className="flex-1 bg-[#f5f5f5]">
    <ProjectDetail project={state.project} onBack={onBack} onStart={() => {
      navigate(`${location.pathname}?view=workspace`, { state });
    }} />
  </div>;
}
