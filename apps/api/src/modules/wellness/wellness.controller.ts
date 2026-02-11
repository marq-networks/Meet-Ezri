import { FastifyReply, FastifyRequest } from 'fastify';
import { createWellnessTool, deleteWellnessTool, getWellnessToolById, getWellnessTools, updateWellnessTool, trackWellnessProgress, getUserWellnessProgress } from './wellness.service';
import { CreateWellnessToolInput, UpdateWellnessToolInput, TrackProgressInput } from './wellness.schema';

export async function createWellnessToolHandler(
  request: FastifyRequest<{ Body: CreateWellnessToolInput }>,
  reply: FastifyReply
) {
  const tool = await createWellnessTool({
    ...request.body,
    created_by: request.user.id
  });
  return reply.code(201).send(tool);
}

export async function getWellnessToolsHandler(
  request: FastifyRequest<{ Querystring: { category?: string } }>,
  reply: FastifyReply
) {
  const tools = await getWellnessTools(request.query.category);
  return reply.send(tools);
}

export async function getWellnessToolByIdHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const tool = await getWellnessToolById(request.params.id);
  if (!tool) {
    return reply.code(404).send({ message: 'Wellness tool not found' });
  }
  return reply.send(tool);
}

export async function updateWellnessToolHandler(
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateWellnessToolInput }>,
  reply: FastifyReply
) {
  try {
    const tool = await updateWellnessTool(request.params.id, request.body);
    return reply.send(tool);
  } catch (error) {
    return reply.code(404).send({ message: 'Wellness tool not found' });
  }
}

export async function getUserWellnessProgressHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const progress = await getUserWellnessProgress(request.user.id);
    return reply.send(progress);
  } catch (error) {
    return reply.code(500).send({ message: 'Failed to fetch wellness progress' });
  }
}

export async function deleteWellnessToolHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    await deleteWellnessTool(request.params.id);
    return reply.code(204).send();
  } catch (error) {
    return reply.code(404).send({ message: 'Wellness tool not found' });
  }
}

export async function trackWellnessProgressHandler(
  request: FastifyRequest<{ Params: { id: string }; Body: TrackProgressInput }>,
  reply: FastifyReply
) {
  try {
    const progress = await trackWellnessProgress(
      request.user.id,
      request.params.id,
      request.body.duration_spent,
      request.body.feedback_rating
    );
    return reply.code(201).send(progress);
  } catch (error) {
    return reply.code(404).send({ message: 'Wellness tool not found' });
  }
}
