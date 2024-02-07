import SemanticEnum from '../models/semantic.enum'

const SemanticRegExp: Record<SemanticEnum, RegExp> = {
  [SemanticEnum.AGUA]: /agua/i,
  [SemanticEnum.SAL_Y_ESPECIAS]: /\bsal\b/i,
}
export default SemanticRegExp
