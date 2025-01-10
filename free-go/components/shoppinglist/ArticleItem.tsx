import { Article } from "@/mockapi/types";
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckBox } from "../utilities/CheckBox";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "../utilities/ThemedText";
import { connectActionSheet } from "@expo/react-native-action-sheet";

type ArticleItemProps = {
    article: Article;
    handleArticleMenu: () => void;
    handleCompleteArticle: () => void;
};

const ArticleItem = ({ article, handleArticleMenu, handleCompleteArticle }: ArticleItemProps) => {
    const colors = useThemeColor();

    return (
      <View style={[styles.articleItem, {backgroundColor: colors.elementBackground}]}>
            <TouchableOpacity
            onPress={handleCompleteArticle}
            style={styles.articleInfoContainer}
            >
                <CheckBox isChecked={!!article.completedAt}/>
                <View style={{flex: 1}}>
                  <ThemedText 
                    color={article.completedAt ? "inactive" : "primaryText"}
                    style={article.completedAt ? { textDecorationLine: "line-through" } : undefined}
                  >
                    {article.quantity === 1 ? article.title : `${article.title} (${article.quantity})`}
                  </ThemedText>
                </View>
            </TouchableOpacity>
            
            <TouchableOpacity
            onPress={handleArticleMenu}
            style={styles.deleteButtonContainer}
            >
            <ThemedText variant="fs20" color="primary">⸱⸱⸱</ThemedText>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    articleItem: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 5,
      borderRadius: 10,
    },
    deleteButtonContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
    },
    articleInfoContainer: {
      flex: 10, 
      padding: 10,
      flexDirection: "row", 
      gap: 10, 
      alignItems: "center"
    }
});

export default connectActionSheet(ArticleItem);