import {
  FormMeshCast,
  MeshBaseCast,
  RuleLoadMeshCast,
  RuleTaskMeshCast,
} from '~/code/cast'

export type MakeTakeCast = {
  rule: {
    task: RuleTaskMeshCast
    load: RuleLoadMeshCast
  }
  call: {
    task: RuleTaskMeshCast
    load: RuleLoadMeshCast
  }
  mesh: MeshBaseCast
  cast: FormMeshCast
}
