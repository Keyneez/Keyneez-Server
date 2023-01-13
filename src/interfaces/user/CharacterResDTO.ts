export interface CharacterResDTO{
    user_key: number;
    user_name: string;
    user_age: number | null;
    user_gender: string;
    user_phone: string;
    user_birth: string;
    user_school: string | null;
    user_character: number | null;
    user_password: string | null;
    user_ocr: string | null;
    ocr_dir: boolean | null;
    user_benefit: boolean | null;
    Characters: {
      character_key: number;
      inter: string;
      dispo: string;
      character: string | null;
      test_img: string | null;
      character_img: string | null;
      character_desc: string | null;
    } | null;
    Items?: object[];
}