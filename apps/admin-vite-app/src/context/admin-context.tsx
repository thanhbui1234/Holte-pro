import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type {
  AboutData,
  AdminState,
  BannerData,
  CanvasElement,
  Collection,
  CollectionItemMap,
  CollectionKey,
  ContactCtaData,
  ContactStatus,
  ContentBlock,
  CustomSection,
  FooterData,
  HeaderData,
  LayoutSection,
  LayoutSectionKey,
  NavMenuItem,
  ThemedSection,
} from "@/types";
import { INITIAL_STATE } from "@/data/mock-data";

type Action =
  | { type: "SET_BANNER"; payload: BannerData }
  | { type: "SET_HEADER"; payload: HeaderData }
  | { type: "SET_ABOUT"; payload: AboutData }
  | { type: "SET_CONTACT_CTA"; payload: ContactCtaData }
  | { type: "SET_FOOTER"; payload: FooterData }
  | { type: "SET_SECTION_CONFIG"; section: CollectionKey; payload: ThemedSection }
  | {
      type: "ADD_ITEM";
      section: CollectionKey;
      payload: CollectionItemMap[CollectionKey];
    }
  | {
      type: "UPDATE_ITEM";
      section: CollectionKey;
      payload: CollectionItemMap[CollectionKey];
    }
  | { type: "DELETE_ITEM"; section: CollectionKey; id: string }
  | { type: "SET_LAYOUT"; payload: LayoutSection[] }
  | { type: "TOGGLE_SECTION"; key: LayoutSectionKey }
  | { type: "ADD_CUSTOM_SECTION"; payload: CustomSection }
  | { type: "UPDATE_CUSTOM_SECTION"; payload: CustomSection }
  | { type: "DELETE_CUSTOM_SECTION"; id: string }
  | { type: "REORDER_CUSTOM_SECTIONS"; payload: CustomSection[] }
  | { type: "TOGGLE_CUSTOM_SECTION"; id: string }
  | { type: "ADD_BLOCK"; sectionId: string; payload: ContentBlock }
  | { type: "UPDATE_BLOCK"; sectionId: string; payload: ContentBlock }
  | { type: "DELETE_BLOCK"; sectionId: string; blockId: string }
  | { type: "REORDER_BLOCKS"; sectionId: string; payload: ContentBlock[] }
  | { type: "SET_CANVAS_ELEMENTS"; sectionId: string; payload: CanvasElement[] }
  | { type: "SET_CANVAS_HEIGHT"; sectionId: string; height: number }
  | { type: "SET_MENU_CONFIG"; payload: NavMenuItem[] }
  | { type: "TOGGLE_MENU_ITEM"; id: string }
  | { type: "UPDATE_MENU_ITEM_LABEL"; id: string; label: string }
  | { type: "SET_CONTACT_STATUS"; id: string; status: ContactStatus }
  | { type: "DELETE_CONTACT"; id: string };

function reducer(state: AdminState, action: Action): AdminState {
  switch (action.type) {
    case "SET_BANNER":
      return { ...state, banner: action.payload };
    case "SET_HEADER":
      return { ...state, header: action.payload };
    case "SET_ABOUT":
      return { ...state, about: action.payload };
    case "SET_CONTACT_CTA":
      return { ...state, contactCta: action.payload };
    case "SET_FOOTER":
      return { ...state, footer: action.payload };
    case "SET_SECTION_CONFIG":
      return {
        ...state,
        [action.section]: { ...state[action.section], config: action.payload },
      };
    case "ADD_ITEM":
      return {
        ...state,
        [action.section]: {
          ...state[action.section],
          items: [...state[action.section].items, action.payload],
        },
      } as AdminState;
    case "UPDATE_ITEM":
      return {
        ...state,
        [action.section]: {
          ...state[action.section],
          items: state[action.section].items.map((item) =>
            item.id === action.payload.id ? action.payload : item,
          ),
        },
      } as AdminState;
    case "DELETE_ITEM":
      return {
        ...state,
        [action.section]: {
          ...state[action.section],
          items: state[action.section].items.filter((item) => item.id !== action.id),
        },
      } as AdminState;
    case "SET_LAYOUT":
      return { ...state, layout: action.payload };
    case "TOGGLE_SECTION":
      return {
        ...state,
        layout: state.layout.map((entry) =>
          entry.key === action.key
            ? { ...entry, visible: !entry.visible }
            : entry,
        ),
      };
    case "ADD_CUSTOM_SECTION":
      return { ...state, customSections: [...state.customSections, action.payload] };
    case "UPDATE_CUSTOM_SECTION":
      return {
        ...state,
        customSections: state.customSections.map((s) =>
          s.id === action.payload.id ? action.payload : s,
        ),
      };
    case "DELETE_CUSTOM_SECTION":
      return {
        ...state,
        customSections: state.customSections.filter((s) => s.id !== action.id),
      };
    case "REORDER_CUSTOM_SECTIONS":
      return { ...state, customSections: action.payload };
    case "TOGGLE_CUSTOM_SECTION":
      return {
        ...state,
        customSections: state.customSections.map((s) =>
          s.id === action.id ? { ...s, visible: !s.visible } : s,
        ),
      };
    case "ADD_BLOCK":
      return {
        ...state,
        customSections: state.customSections.map((s) =>
          s.id === action.sectionId
            ? { ...s, blocks: [...s.blocks, action.payload], updatedAt: Date.now() }
            : s,
        ),
      };
    case "UPDATE_BLOCK":
      return {
        ...state,
        customSections: state.customSections.map((s) =>
          s.id === action.sectionId
            ? {
                ...s,
                blocks: s.blocks.map((b) =>
                  b.id === action.payload.id ? action.payload : b,
                ),
                updatedAt: Date.now(),
              }
            : s,
        ),
      };
    case "DELETE_BLOCK":
      return {
        ...state,
        customSections: state.customSections.map((s) =>
          s.id === action.sectionId
            ? {
                ...s,
                blocks: s.blocks.filter((b) => b.id !== action.blockId),
                updatedAt: Date.now(),
              }
            : s,
        ),
      };
    case "REORDER_BLOCKS":
      return {
        ...state,
        customSections: state.customSections.map((s) =>
          s.id === action.sectionId
            ? { ...s, blocks: action.payload, updatedAt: Date.now() }
            : s,
        ),
      };
    case "SET_CANVAS_ELEMENTS":
      return {
        ...state,
        customSections: state.customSections.map((s) =>
          s.id === action.sectionId
            ? { ...s, canvasElements: action.payload, updatedAt: Date.now() }
            : s,
        ),
      };
    case "SET_CANVAS_HEIGHT":
      return {
        ...state,
        customSections: state.customSections.map((s) =>
          s.id === action.sectionId
            ? { ...s, canvasHeight: action.height, updatedAt: Date.now() }
            : s,
        ),
      };
    case "SET_MENU_CONFIG":
      return { ...state, menuConfig: action.payload };
    case "TOGGLE_MENU_ITEM":
      return {
        ...state,
        menuConfig: state.menuConfig.map((item) =>
          item.id === action.id ? { ...item, visible: !item.visible } : item,
        ),
      };
    case "UPDATE_MENU_ITEM_LABEL":
      return {
        ...state,
        menuConfig: state.menuConfig.map((item) =>
          item.id === action.id ? { ...item, label: action.label } : item,
        ),
      };
    case "SET_CONTACT_STATUS":
      return {
        ...state,
        contactSubmissions: state.contactSubmissions.map((s) =>
          s.id === action.id ? { ...s, status: action.status } : s,
        ),
      };
    case "DELETE_CONTACT":
      return {
        ...state,
        contactSubmissions: state.contactSubmissions.filter((s) => s.id !== action.id),
      };
    default:
      return state;
  }
}

interface AdminContextValue {
  state: AdminState;
  dispatch: React.Dispatch<Action>;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

function useAdminContext(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within <AdminProvider>");
  return ctx;
}

/* ────────────────────────────────────────────────────────────
 *  Domain hooks — pages depend on these, not the reducer shape.
 * ──────────────────────────────────────────────────────────── */

export function useBanner() {
  const { state, dispatch } = useAdminContext();
  const save = useCallback(
    (payload: BannerData) => dispatch({ type: "SET_BANNER", payload }),
    [dispatch],
  );
  return { data: state.banner, save };
}

export function useHeader() {
  const { state, dispatch } = useAdminContext();
  const save = useCallback(
    (payload: HeaderData) => dispatch({ type: "SET_HEADER", payload }),
    [dispatch],
  );
  return { data: state.header, save };
}

export function useAbout() {
  const { state, dispatch } = useAdminContext();
  const save = useCallback(
    (payload: AboutData) => dispatch({ type: "SET_ABOUT", payload }),
    [dispatch],
  );
  return { data: state.about, save };
}

export function useContactCta() {
  const { state, dispatch } = useAdminContext();
  const save = useCallback(
    (payload: ContactCtaData) => dispatch({ type: "SET_CONTACT_CTA", payload }),
    [dispatch],
  );
  return { data: state.contactCta, save };
}

export function useFooter() {
  const { state, dispatch } = useAdminContext();
  const save = useCallback(
    (payload: FooterData) => dispatch({ type: "SET_FOOTER", payload }),
    [dispatch],
  );
  return { data: state.footer, save };
}

export function useLayout() {
  const { state, dispatch } = useAdminContext();
  const reorder = useCallback(
    (payload: LayoutSection[]) => dispatch({ type: "SET_LAYOUT", payload }),
    [dispatch],
  );
  const toggle = useCallback(
    (key: LayoutSectionKey) => dispatch({ type: "TOGGLE_SECTION", key }),
    [dispatch],
  );
  return { layout: state.layout, reorder, toggle };
}

export interface CollectionApi<K extends CollectionKey> {
  config: ThemedSection;
  items: CollectionItemMap[K][];
  saveConfig: (config: ThemedSection) => void;
  add: (item: CollectionItemMap[K]) => void;
  update: (item: CollectionItemMap[K]) => void;
  remove: (id: string) => void;
}

export function useCollection<K extends CollectionKey>(section: K): CollectionApi<K> {
  const { state, dispatch } = useAdminContext();
  const slice = state[section] as Collection<ThemedSection, CollectionItemMap[K]>;

  const saveConfig = useCallback(
    (config: ThemedSection) =>
      dispatch({ type: "SET_SECTION_CONFIG", section, payload: config }),
    [dispatch, section],
  );
  const add = useCallback(
    (item: CollectionItemMap[K]) =>
      dispatch({ type: "ADD_ITEM", section, payload: item }),
    [dispatch, section],
  );
  const update = useCallback(
    (item: CollectionItemMap[K]) =>
      dispatch({ type: "UPDATE_ITEM", section, payload: item }),
    [dispatch, section],
  );
  const remove = useCallback(
    (id: string) => dispatch({ type: "DELETE_ITEM", section, id }),
    [dispatch, section],
  );

  return {
    config: slice.config,
    items: slice.items,
    saveConfig,
    add,
    update,
    remove,
  };
}

export function useAdminState(): AdminState {
  return useAdminContext().state;
}

export function useCustomSections() {
  const { state, dispatch } = useAdminContext();

  const add = useCallback(
    (section: CustomSection) =>
      dispatch({ type: "ADD_CUSTOM_SECTION", payload: section }),
    [dispatch],
  );
  const update = useCallback(
    (section: CustomSection) =>
      dispatch({ type: "UPDATE_CUSTOM_SECTION", payload: section }),
    [dispatch],
  );
  const remove = useCallback(
    (id: string) => dispatch({ type: "DELETE_CUSTOM_SECTION", id }),
    [dispatch],
  );
  const reorder = useCallback(
    (sections: CustomSection[]) =>
      dispatch({ type: "REORDER_CUSTOM_SECTIONS", payload: sections }),
    [dispatch],
  );
  const toggle = useCallback(
    (id: string) => dispatch({ type: "TOGGLE_CUSTOM_SECTION", id }),
    [dispatch],
  );
  const addBlock = useCallback(
    (sectionId: string, block: ContentBlock) =>
      dispatch({ type: "ADD_BLOCK", sectionId, payload: block }),
    [dispatch],
  );
  const updateBlock = useCallback(
    (sectionId: string, block: ContentBlock) =>
      dispatch({ type: "UPDATE_BLOCK", sectionId, payload: block }),
    [dispatch],
  );
  const deleteBlock = useCallback(
    (sectionId: string, blockId: string) =>
      dispatch({ type: "DELETE_BLOCK", sectionId, blockId }),
    [dispatch],
  );
  const reorderBlocks = useCallback(
    (sectionId: string, blocks: ContentBlock[]) =>
      dispatch({ type: "REORDER_BLOCKS", sectionId, payload: blocks }),
    [dispatch],
  );
  const setCanvasElements = useCallback(
    (sectionId: string, elements: CanvasElement[]) =>
      dispatch({ type: "SET_CANVAS_ELEMENTS", sectionId, payload: elements }),
    [dispatch],
  );
  const setCanvasHeight = useCallback(
    (sectionId: string, height: number) =>
      dispatch({ type: "SET_CANVAS_HEIGHT", sectionId, height }),
    [dispatch],
  );

  return {
    sections: state.customSections,
    add,
    update,
    remove,
    reorder,
    toggle,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    setCanvasElements,
    setCanvasHeight,
  };
}

export function useMenuConfig() {
  const { state, dispatch } = useAdminContext();

  const reorder = useCallback(
    (payload: NavMenuItem[]) => dispatch({ type: "SET_MENU_CONFIG", payload }),
    [dispatch],
  );
  const toggle = useCallback(
    (id: string) => dispatch({ type: "TOGGLE_MENU_ITEM", id }),
    [dispatch],
  );
  const updateLabel = useCallback(
    (id: string, label: string) => dispatch({ type: "UPDATE_MENU_ITEM_LABEL", id, label }),
    [dispatch],
  );

  return { menuConfig: state.menuConfig, reorder, toggle, updateLabel };
}

export function useContactSubmissions() {
  const { state, dispatch } = useAdminContext();

  const setStatus = useCallback(
    (id: string, status: ContactStatus) =>
      dispatch({ type: "SET_CONTACT_STATUS", id, status }),
    [dispatch],
  );

  const remove = useCallback(
    (id: string) => dispatch({ type: "DELETE_CONTACT", id }),
    [dispatch],
  );

  const unreadCount = state.contactSubmissions.filter((s) => s.status === "new").length;

  return {
    submissions: state.contactSubmissions,
    unreadCount,
    setStatus,
    remove,
  };
}
