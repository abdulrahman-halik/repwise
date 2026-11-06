import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProgram, lessonsForProgram } from '@/lib/queries';
import { ProgramEditorClient } from './ProgramEditorClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const program = getProgram(id);
  if (!program) return { title: 'Program Not Found' };
  return {
    title: `Edit ${program.title} · Trainer Studio`,
    description: `Manage lessons and pricing for ${program.title}`,
  };
}

export default async function ProgramEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const program = getProgram(id);
  if (!program) notFound();

  const lessons = lessonsForProgram(id);

  return <ProgramEditorClient program={program} initialLessons={lessons} />;
}

