
declare module "*.json" {
  // Update type definition to support nested structures
  type TranslationValue = string | { [key: string]: TranslationValue };
  const value: Record<string, TranslationValue>;
  export default value;
}
