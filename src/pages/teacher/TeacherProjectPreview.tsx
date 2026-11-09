import { useLocation, useNavigate } from 'react-router-dom';
import ProjectDetail, { type ProjectData } from '@/components/ProjectDetail';
import ProjectIDE from '@/components/ProjectIDE';
import ProjectVMWorkspace, { type ProjectVirtualMachine } from '@/components/ProjectVMWorkspace';
import NetworkProjectWorkspace from '@/components/NetworkProjectWorkspace';

export default function TeacherProjectPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { project?: ProjectData; projectId?: number; scene?: string; environment?: ProjectVirtualMachine; environments?: ProjectVirtualMachine[]; canEdit?: boolean; returnTo?: string; returnState?: Record<string, unknown> } | null;
  const onBack = () => {
    const [path, search = ''] = (state?.returnTo || '/teacher').split('?');
    const params = new URLSearchParams(search);
    params.set('tab', 'project');
    navigate(`${path}?${params}`, {
      state: { ...state?.returnState, activeSubTab: 'project', scene: state?.scene },
      replace: true,
    });
  };

  if (!state?.project) {
    return <div className="flex-1 bg-[#f5f6f8] p-8 text-center">
      <p className="mb-4 text-neutral-600">请从项目列表选择要预览的项目</p>
      <button onClick={onBack} className="text-[#fa541c] cursor-pointer">返回项目列表</button>
    </div>;
  }

  if (new URLSearchParams(location.search).get('view') === 'workspace') {
    if (state.scene === '网络仿真') {
      return <NetworkProjectWorkspace projectId={state.projectId || 101} title={state.project.title} canEdit={state.canEdit === true} onBack={onBack} />;
    }
    if (state.environment?.type === '虚机') {
      const machines = (state.environments || [state.environment]).filter(item => item.type === '虚机');
      return <ProjectVMWorkspace title={state.project.title} machines={machines} canEdit={state.canEdit === true} onBack={onBack} />;
    }
    return <ProjectIDE projectTitle={state.project.title} showAIAssistant={false} showChecks onBack={onBack} />;
  }

  return <div className="flex-1 bg-[#f5f5f5]">
    <ProjectDetail project={state.project} onBack={onBack} onStart={() => {
      navigate(`${location.pathname}?view=workspace`, { state });
    }} />
  </div>;
}
