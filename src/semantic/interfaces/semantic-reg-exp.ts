import SemanticEnum from './semantic.enum'

const SemanticRegExp: Record<SemanticEnum, RegExp> = {
  [SemanticEnum.AGUA]: /agua/i,
  [SemanticEnum.SAL]: /sal/i,
}
export default SemanticRegExp
