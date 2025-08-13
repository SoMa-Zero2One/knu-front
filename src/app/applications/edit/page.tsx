import { Metadata } from 'next';
import EditApplicationsClient from './EditApplicationsClient';

export const metadata: Metadata = {
  title: '지원 대학교 변경 - 교환학생 경쟁률',
  description: '교환학생 지원 대학교를 변경하고 관리하세요. 최대 5개 대학교까지 지원 가능합니다.',
};

export default function EditApplicationsPage() {
  return <EditApplicationsClient />;
}