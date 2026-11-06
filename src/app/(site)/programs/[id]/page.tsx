import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProgram, getTrainer, lessonsForProgram } from '@/lib/queries';
import { ProgramPlayerClient } from './ProgramPlayerClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const program = getProgram(id);
  if (!program) return { title: 'Program Not Found' };
  return {
    title: `${program.title} · Video Program`,
    description: program.description,
  };
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const program = getProgram(id);
  if (!program) notFound();

  const trainer = getTrainer(program.trainerId);
  if (!trainer) notFound();

  const lessons = lessonsForProgram(id);

  return <ProgramPlayerClient program={program} trainer={trainer} lessons={lessons} />;
}

