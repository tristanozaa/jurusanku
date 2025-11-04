// This is the core "algorithm" mapping RIASEC profiles to major IDs.
// Updated to use the new 20 major IDs.
export const MAJOR_RECOMMENDATIONS_DATA: Record<string, string[]> = {
    R: ['teknik-mesin', 'teknik-sipil', 'arsitektur', 'kehutanan'],
    I: ['teknologi-informasi', 'ilmu-komputer', 'pendidikan-dokter', 'farmasi', 'statistika'],
    A: ['arsitektur', 'ilmu-komunikasi', 'sastra-inggris', 'antropologi-budaya'],
    S: ['ilmu-komunikasi', 'pendidikan-dokter', 'psikologi', 'sosiologi'],
    E: ['manajemen', 'ilmu-komunikasi', 'ilmu-hukum', 'akuntansi'],
    C: ['manajemen', 'akuntansi', 'statistika', 'ilmu-ekonomi'],
};