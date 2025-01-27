import FamilyMemberItem from "@/components/families/FamilyMemberItem";
import WaitingScreen from "@/components/utilities/WaitingScreen";
import { API, useFetchQuery } from "@/hooks/useAPI";
import { Family, FamilyMember, FamilyMemberRole } from "@/types/Family";
import Error from "@/utils/alerts/Error";
import { GetUserInfos } from "@/utils/api/auth/UserInfos";
import { SetBackPage } from "@/utils/SetBackPage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { FlatList } from "react-native";

export default function FamilyIndexPage() {
  SetBackPage("/families");
  const [familyInfos, setFamilyInfos] = useState<Family | undefined>(undefined);
  const [members, setMembers] = useState<FamilyMember[] | undefined>(undefined);
  const [currentUserRole, setCurrentUserRole] = useState<FamilyMemberRole | undefined>(undefined);

  const params = useLocalSearchParams();
  const familyId = Number(params.id);

  const loadFamilyMembers = async () => {
    try {
      const members = await useFetchQuery<API['/families/[id]/members']>(`/families/${familyId}/members`, { method: "GET" });
      setMembers(members.data);

      const currentUser = await GetUserInfos();
      setCurrentUserRole(members.data.find((member) => member.user.id == currentUser.id)?.role);
    } catch (error) {
      Error("Erreur", "Erreur de chargement des données", error);
    }
  }

  const removeMember = async (member: FamilyMember) => {
    try {
      const res = await useFetchQuery<API['/families/[id]/members/[id]']>(`/families/${familyId}/members/${member.user.id}`, { method: "DELETE" });
      if (res.code == 200) {
        await loadFamilyMembers();
      } else {
        Error("Erreur", "Erreur de suppression du membre", res);
      }
    } catch (error) {
      Error("Erreur", "Erreur de suppression du membre", error);
    }
  }

  useEffect(() => {
    useFetchQuery<API['/families/[id]']>(`/families/${familyId}`, { method: "GET" }).then(async (res) => {
      if (res.code == 200) {
        await loadFamilyMembers();
        setFamilyInfos(res.data);
      } else {
        router.push("/families");
      }
    }).catch((error) => {
      Error("Erreur", "Erreur de chargement des données", error);
    })
  }, []);

  return (
    <View>
      {!familyInfos ? <WaitingScreen /> : <View>
        <Text>{familyInfos.name}</Text>
        <Text>Code pour rejoindre: {familyInfos.joinCode}</Text>
        <Text>Liste des membres :</Text>
        <FlatList
          data={members}
          keyExtractor={(member) => member.user.id.toString()}
          renderItem={({ item: member }) => (
            <FamilyMemberItem
              member={member}
              onFireButtonPressed={currentUserRole == FamilyMemberRole.Owner && member.role != FamilyMemberRole.Owner ? () => {
                removeMember(member);
              } : undefined}
            />
          )}
        />
      </View>}
    </View>
  )
}