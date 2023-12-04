import {
  FormMeshCast,
  MeshBaseCast,
  RuleLoadMeshCast,
  RuleTaskMeshCast,
} from '~/code/cast'

export type MakeTakeCast = {
  file: string
  rule: {
    task: RuleTaskMeshCast
    load: RuleLoadMeshCast
  }
  call: {
    task: RuleTaskMeshCast
    load: RuleLoadMeshCast
  }
  mesh: MeshBaseCast
  form: FormMeshCast
}
